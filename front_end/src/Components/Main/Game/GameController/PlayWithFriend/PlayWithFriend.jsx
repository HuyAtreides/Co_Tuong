import React, { useEffect, useState, useContext, useRef } from "react";
import "./PlayWithFriend.scss";
import { Button, Tooltip, Overlay } from "react-bootstrap";
import renderPlayersList from "./renderPlayersList.js";
import renderPendingPlayers from "./renderPendingPlayers.js";
import callAPI from "../../../../App/callAPI.js";
import { SocketContext } from "../../../../App/context.js";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";

const PlayWithFriend = (props) => {
  const [input, setInput] = useState("");
  const [playersList, setPlayersList] = useState([]);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [pendingPlayers, setPendingPlayers] = useState({});
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const socket = useContext(SocketContext);
  const [show, setShow] = useState("");
  const target = useRef(null);
  const [invitedPlayer, setInvitedPlayer] = useState(null);
  const time = useSelector((state) => state.gameState.time);

  const handleSelectPlayer = (event) => {
    const name = event.currentTarget.getAttribute("playername");
    setInput(name);
    setPlayersList([]);
  };

  const replaceSpecialCharacters = (str) => {
    return str.replace(
      /[^0-9a-zA-Z_ÁáÀàẢảÃãẠạĂăẮắẰằẲẳẴẵẶặÂâẤấẦầẨẩẪẫẬậĐđÉéÈèẺẻẼẽẸẹÊêẾếỀềỂểỄễỆệÍíÌìỈỉĨĩỊịÓóÒòỎỏÕõỌọÔôỐốỒồỔổỖỗỘộƠơỚớỜờỞởỠỡỢợÚúÙùỦủŨũỤụƯưỨứỪừỬửỮữỰựÝýỲỳỶỷỸỹỴỵ -]+/g,
      ""
    );
  };

  const handleOnChange = async (event) => {
    try {
      const value = event.currentTarget.value;
      setInput(value);
      if (value) {
        const { players } = await callAPI("POST", "players", {
          playername: replaceSpecialCharacters(value),
        });
        const reCheck = document.querySelector("#player-name-search").value;
        if (!players) return;
        const name = playerInfo.username;
        if (reCheck)
          setPlayersList(renderPlayersList(players, handleSelectPlayer, name));
      } else setPlayersList([]);
    } catch (err) {
      handleCanotSendInvite(err.toString());
    }
  };

  const cancelInvite = (event) => {
    const playername = event.currentTarget.getAttribute("playername");
    socket.emit("cancelInvite", pendingPlayers[playername].socketID, false);
    delete pendingPlayers[playername];
    setPendingPlayers(Object.assign({}, pendingPlayers));
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
      if (!pendingPlayers[input]) {
        setWaitForResponse(true);
        const { players } = await callAPI("POST", "players", {
          playername: replaceSpecialCharacters(input),
        });
        if (players.length && players[0].username !== playerInfo.username) {
          if (players[0].socketID) {
            if (Object.keys(pendingPlayers).length + 1 > 5) {
              handleCanotSendInvite("You have sent too many invites");
              return;
            }
            setInvitedPlayer(players[0]);
            socket.emit("sendInvite", players[0].socketID, time);
          } else handleCanotSendInvite(`${players[0].username} isn't online`);
        } else handleCanotSendInvite("user not found");
      }
    } catch (err) {
      handleCanotSendInvite(err.toString());
    }
  };

  const clearInput = () => {
    setInput("");
    setPlayersList([]);
  };

  useEffect(() => {
    socket.on("validInvite", () => {
      setWaitForResponse(false);
      setPendingPlayers((prevState) => {
        const newState = Object.assign({}, prevState);
        newState[invitedPlayer.username] = invitedPlayer;
        return newState;
      });
    });

    socket.on("inviteDeclined", (receiverInfo) => {
      setPendingPlayers((prevState) => {
        const newState = Object.assign({}, prevState);
        if (newState[receiverInfo.playername])
          newState[receiverInfo.playername].declineInvite = true;
        return newState;
      });
      setTimeout(() => {
        setPendingPlayers((prevState) => {
          const newState = Object.assign({}, prevState);
          delete newState[receiverInfo.playername];
          return newState;
        });
      }, 1000);
    });

    socket.on("playerInGame", (playername) => {
      setWaitForResponse(false);
      handleCanotSendInvite(`${playername} is in a game`);
    });

    socket.on("invalidInvite", (playername) => {
      setWaitForResponse(false);
      handleCanotSendInvite(`${playername} have received too many invites`);
    });

    return () => {
      socket.removeAllListeners("validInvite");
      socket.removeAllListeners("invalidInvite");
      socket.removeAllListeners("inviteDeclined");
    };
  }, [invitedPlayer]);

  useEffect(() => {
    return () => {
      socket.emit("cancelInvite", null, true);
    };
  }, []);

  return (
    <div className="play-with-friend-container">
      <i className="fas fa-arrow-left fa-2x" onClick={props.return}></i>
      <ul className="players-pending players-list">
        {renderPendingPlayers(pendingPlayers, cancelInvite)}
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
            placeholder="Search..."
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
            ) : (
              "Invite"
            )}
          </Button>
          <Overlay target={target.current} show={show !== ""}>
            {(props) => <Tooltip {...props}>{show}</Tooltip>}
          </Overlay>
          <ul className="players-list">{playersList}</ul>
        </form>
        <Button className="invite-link">Invite Link</Button>
      </div>
    </div>
  );
};

export default PlayWithFriend;
