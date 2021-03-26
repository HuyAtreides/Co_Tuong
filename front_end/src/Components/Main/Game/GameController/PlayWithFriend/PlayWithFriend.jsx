import React, { useEffect, useState, useContext } from "react";
import "./PlayWithFriend.scss";
import { Button } from "react-bootstrap";
import renderPlayersList from "./renderPlayersList.js";
import renderPendingPlayers from "./renderPendingPlayers.js";
import callAPI from "../../../../App/callAPI.js";
import { SocketContext } from "../../../../App/context.js";
import { Spinner } from "react-bootstrap";

const PlayWithFriend = (props) => {
  const [input, setInput] = useState("");
  const [playersList, setPlayersList] = useState([]);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [pendingPlayers, setPendingPlayers] = useState({});
  const socket = useContext(SocketContext);

  const handleSelectPlayer = (event) => {
    const name = event.currentTarget.getAttribute("playername");
    setInput(name);
    setPlayersList([]);
  };

  const handleOnChange = async (event) => {
    const value = event.currentTarget.value;
    setInput(value);
    if (value) {
      const { players } = await callAPI("POST", "players", {
        playername: value.replace(
          /[^0-9a-zA-Z_ÁáÀàẢảÃãẠạĂăẮắẰằẲẳẴẵẶặÂâẤấẦầẨẩẪẫẬậĐđÉéÈèẺẻẼẽẸẹÊêẾếỀềỂểỄễỆệÍíÌìỈỉĨĩỊịÓóÒòỎỏÕõỌọÔôỐốỒồỔổỖỗỘộƠơỚớỜờỞởỠỡỢợÚúÙùỦủŨũỤụƯưỨứỪừỬửỮữỰựÝýỲỳỶỷỸỹỴỵ -]+/g,
          ""
        ),
      });
      const reCheck = document.querySelector("#player-name-search").value;
      if (!players) return;
      if (reCheck)
        setPlayersList(renderPlayersList(players, handleSelectPlayer));
    } else setPlayersList([]);
  };

  const cancelInvite = (event) => {
    const username = event.currentTarget.getAttribute("playername");
    delete pendingPlayers[username];
    setPendingPlayers(Object.assign({}, pendingPlayers));
  };

  const handleSendInvite = async (event) => {
    event.preventDefault();
    if (!pendingPlayers[input]) {
      setWaitForResponse(true);
      const { players } = await callAPI("POST", "players", {
        playername: input.replace(
          /[^0-9a-zA-Z_ÁáÀàẢảÃãẠạĂăẮắẰằẲẳẴẵẶặÂâẤấẦầẨẩẪẫẬậĐđÉéÈèẺẻẼẽẸẹÊêẾếỀềỂểỄễỆệÍíÌìỈỉĨĩỊịÓóÒòỎỏÕõỌọÔôỐốỒồỔổỖỗỘộƠơỚớỜờỞởỠỡỢợÚúÙùỦủŨũỤụƯưỨứỪừỬửỮữỰựÝýỲỳỶỷỸỹỴỵ -]+/g,
          ""
        ),
      });
      setWaitForResponse(false);
      if (players && players[0].socketID) {
        setPendingPlayers((prevState) => {
          const newState = Object.assign({}, prevState);
          newState[players[0].username] = players[0];
          return newState;
        });
        socket.emit("sendInvite", players[0].socketID);
      }
    }
  };

  const clearInput = () => {
    setInput("");
    setPlayersList([]);
  };

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
          <Button className="invite" type="submit">
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
          <ul className="players-list">{playersList}</ul>
        </form>
        <Button className="invite-link">Invite Link</Button>
      </div>
    </div>
  );
};

export default PlayWithFriend;
