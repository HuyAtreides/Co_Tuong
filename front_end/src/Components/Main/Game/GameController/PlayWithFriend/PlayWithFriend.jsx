import React, { useEffect, useState, useContext } from "react";
import "./PlayWithFriend.scss";
import { Button } from "react-bootstrap";
import renderPlayersList from "./renderPlayersList";
import callAPI from "../../../../App/callAPI.js";
import { SocketContext } from "../../../../App/context.js";

const PlayWithFriend = (props) => {
  const [input, setInput] = useState("");
  const [playersList, setPlayersList] = useState([]);
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
        playername: value.replace(/[^0-9a-zA-Z_-]+/g, ""),
      });
      const reCheck = document.querySelector("#player-name-search").value;
      if (!players) return;
      if (reCheck)
        setPlayersList(renderPlayersList(players, handleSelectPlayer));
    } else setPlayersList([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const clearInput = () => {
    setInput("");
    setPlayersList([]);
  };

  return (
    <div className="play-with-friend-container">
      <i className="fas fa-arrow-left fa-2x" onClick={props.return}></i>
      <ul className="players-pending players-list">
        {/* <li>
          <div>
            <img
              src="https://betacssjs.chesscomfiles.com/bundles/web/images/black_400.918cdaa6.png"
              alt=""
            />
          </div>
          <p>Opponent</p>
          <p className="pending">Pending...</p>
        </li> */}
      </ul>
      <div className="btn-container">
        <form className="username-input" onSubmit={handleSubmit} method="POST">
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
            Invite
          </Button>
          <ul className="players-list">{playersList}</ul>
        </form>
        <Button className="invite-link">Invite Link</Button>
      </div>
    </div>
  );
};

export default PlayWithFriend;
