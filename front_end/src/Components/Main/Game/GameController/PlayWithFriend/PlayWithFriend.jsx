import React, { useEffect, useState, useContext, useRef } from "react";
import "./PlayWithFriend.scss";
import { Button, Tooltip, Overlay, Spinner } from "react-bootstrap";
import renderPlayersList from "./renderPlayersList.js";
import renderPendingPlayers from "./renderPendingPlayers.js";
import callAPI from "../../../../App/callAPI.js";
import { SocketContext } from "../../../../App/context.js";
import { useSelector } from "react-redux";

const PlayWithFriend = ({ goBack, lang }) => {
  const [input, setInput] = useState("");
  const [playersList, setPlayersList] = useState([]);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [pendingPlayers, setPendingPlayers] = useState([]);
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const socket = useContext(SocketContext);
  const [show, setShow] = useState("");
  const target = useRef(null);
  const copyButton = useRef(null);
  const [inviteLink, setInviteLink] = useState("");
  const [invitedPlayer, setInvitedPlayer] = useState(null);
  const time = useSelector((state) => state.gameState.time);
  const side = useSelector((state) => state.boardState.side);

  const [showText, setShowText] = useState(false);

  const handleSelectPlayer = (event) => {
    const name = event.currentTarget.getAttribute("playername");
    setInput(name);
    setPlayersList([]);
  };

  const replaceSpecialCharacters = (str) => {
    return str.replace(/[^0-9a-zA-Z_-]+/g, "");
  };

  const handleOnChange = async (event) => {
    try {
      const value = event.currentTarget.value;
      setInput(value);
      if (value) {
        const { players } = await callAPI("POST", "api/players", {
          playername: replaceSpecialCharacters(value),
        });
        const reCheck = document.querySelector("#player-name-search").value;
        if (!players) return;
        const name = playerInfo.username;
        if (reCheck)
          setPlayersList(renderPlayersList(players, handleSelectPlayer, name));
      } else setPlayersList([]);
    } catch (_) {
      handleCanotSendInvite(
        lang === "English"
          ? "Something went wrong there. Try again"
          : "Đã xảy ra lỗi. Xin hãy thử lại"
      );
    }
  };

  const cancelInvite = (event) => {
    const playername = event.currentTarget.getAttribute("playername");
    const index = pendingPlayers.findIndex(
      (player) => player.username === playername
    );
    socket.emit("cancelInvite", pendingPlayers[index].socketID, false);
    setPendingPlayers((prevState) => {
      prevState.splice(index, 1);
      return [...prevState];
    });
  };

  const handleCanotSendInvite = (reason) => {
    setWaitForResponse(false);
    setShow(reason);
    setTimeout(() => {
      setShow("");
    }, 1000);
  };

  const handleSendInvite = async (event) => {
    try {
      event.preventDefault();
      if (waitForResponse) return;
      const index = pendingPlayers.findIndex(
        (player) => player.username === input
      );
      if (index === -1) {
        setWaitForResponse(true);
        const { players } = await callAPI("POST", "api/players", {
          playername: replaceSpecialCharacters(input),
          exact: true,
        });
        if (players.length && players[0].username !== playerInfo.username) {
          if (players[0].socketID) {
            if (pendingPlayers.length + 1 > 5) {
              handleCanotSendInvite(
                lang === "English"
                  ? "You have sent too many invites"
                  : "Bạn đã gửi quá nhiều lời mời"
              );
              return;
            }
            setInvitedPlayer(players[0]);
            socket.emit("setTimeAndSide", time, side[1], () => {
              socket.emit(
                "sendInvite",
                players[0].socketID,
                players[0].username
              );
            });
          } else
            handleCanotSendInvite(
              `${players[0].username} ${
                lang === "English" ? "isn't" : "không"
              } online`
            );
        } else
          handleCanotSendInvite(
            lang === "English" ? "user not found" : "không tìm thấy"
          );
      }
    } catch (_) {
      handleCanotSendInvite(
        lang === "English"
          ? "Something went wrong there. Try again"
          : "Đã xảy ra lỗi. Xin hãy thử lại"
      );
    }
  };

  const clearInput = () => {
    setInput("");
    setPlayersList([]);
  };

  const handleGenerateInviteLink = () => {
    socket.emit("setTimeAndSide", time, side[1], () => {
      socket.emit("generateInviteLink", (inviteLink) => {
        setInviteLink(inviteLink);
      });
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink).then(() => {
      setShowText(true);
      setTimeout(() => {
        setShowText(false);
      }, 1000);
    });
  };

  useEffect(() => {
    socket.on("validInvite", () => {
      setWaitForResponse(false);
      setPendingPlayers((prevState) => {
        prevState.push(invitedPlayer);
        return [...prevState];
      });
    });

    socket.on("inviteDeclined", (receiverInfo) => {
      const index = pendingPlayers.findIndex(
        (player) => player.username === receiverInfo.playername
      );
      if (index !== -1) {
        setPendingPlayers((prevState) => {
          prevState[index].declineInvite = true;
          return [...prevState];
        });
        setTimeout(() => {
          setPendingPlayers((prevState) => {
            prevState.splice(index, 1);
            return [...prevState];
          });
        }, 1000);
      }
    });

    socket.on("invalidInvite", (message) => {
      setWaitForResponse(false);
      let messageInVi = `${invitedPlayer.username} đang trong trận`;
      if (/disconnected/.test(message))
        messageInVi = `${invitedPlayer.username} có thể đã bị ngắt kết nối`;
      else messageInVi = `${invitedPlayer.username} đã nhận quá nhiều lời mời`;
      handleCanotSendInvite(lang === "English" ? message : messageInVi);
    });

    return () => {
      socket.removeAllListeners("validInvite");
      socket.removeAllListeners("invalidInvite");
      socket.removeAllListeners("inviteDeclined");
      socket.removeAllListeners("playerInGame");
    };
  }, [invitedPlayer, pendingPlayers]);

  useEffect(() => {
    return () => {
      socket.emit("cancelInvite", null, true);
    };
  }, []);

  return (
    <div className="play-with-friend-container">
      <i className="fas fa-arrow-left fa-2x" onClick={goBack}></i>
      <ul className="players-pending players-list">
        {renderPendingPlayers(pendingPlayers, cancelInvite, lang)}
      </ul>
      <div className="btn-container">
        <form
          className="username-input"
          onSubmit={handleSendInvite}
          method="POST"
        >
          <i className="fas fa-search"></i>
          <input
            id="player-name-search"
            type="text"
            placeholder={lang === "English" ? "Search..." : "Tìm kiếm..."}
            onInput={handleOnChange}
            value={input}
          />
          <i
            className="fas fa-times"
            onClick={clearInput}
            style={{ display: input ? "inline" : "none" }}
          ></i>
          <Button className="invite" type="submit" ref={target}>
            {waitForResponse ? (
              <Spinner
                animation="border"
                variant="info"
                style={{ width: "1.5rem", height: "1.5rem" }}
              />
            ) : lang === "English" ? (
              "Invite"
            ) : (
              <>&nbsp;&nbsp;Mời&nbsp;&nbsp;</>
            )}
          </Button>
          <Overlay target={target.current} show={show !== ""}>
            {(props) => <Tooltip {...props}>{show}</Tooltip>}
          </Overlay>
          <ul className="players-list">{playersList}</ul>
        </form>
        <Button className="invite-link" onClick={handleGenerateInviteLink}>
          {lang === "English" ? "Invite Link" : "Link Mời"}
        </Button>
        <div
          className="link-container"
          style={{ display: inviteLink ? "flex" : "none" }}
        >
          <i className="fas fa-times" onClick={() => setInviteLink("")}></i>
          <input
            type="text"
            value={inviteLink}
            className="link"
            readOnly={true}
          />
          <button
            className="copy-link"
            onClick={handleCopyLink}
            ref={copyButton}
          >
            {lang === "English" ? "Copy" : "Sao Chép"}
          </button>
          <Overlay placement="top" show={showText} target={copyButton.current}>
            {({ placement, arrowProps, show: _show, popper, ...props }) => (
              <div {...props} className="copied">
                {lang === "English" ? "Copied" : "Đã Sao Chép"}
              </div>
            )}
          </Overlay>
        </div>
      </div>
    </div>
  );
};

export default PlayWithFriend;
