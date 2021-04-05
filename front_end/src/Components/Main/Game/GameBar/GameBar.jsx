import React, { useContext } from "react";
import { SocketContext } from "../../../App/context.js";
import { Col, Button } from "react-bootstrap";
import "./GameBar.scss";
import ChatSection from "./ChatSection/ChatSection.jsx";
import { useDispatch, useSelector } from "react-redux";

const GameBar = (props) => {
  const dispatch = useDispatch();
  const receiveDrawOffer = useSelector(
    (state) => state.gameState.receiveDrawOffer
  );
  const gameResult = useSelector((state) => state.gameState.gameResult);
  const socket = useContext(SocketContext);
  const pause = useSelector((state) => state.gameState.pause);
  const playerInfo = useSelector((state) => state.appState.playerInfo);

  const handlePauseOrResume = (event) => {
    const action = event.currentTarget.id;
    const message = {
      from: `${playerInfo.username}`,
      message: `${action}d Game`,
      className: "game-message",
    };
    dispatch({ type: "setMessage", value: message });
    dispatch({
      type: "setPause",
      value: `${playerInfo.username} ${action}d Game`,
    });
    socket.emit(`player${action}Game`);
  };

  const handleOfferDraw = () => {
    if (!receiveDrawOffer) {
      dispatch({
        type: "setMessage",
        value: {
          from: `${playerInfo.username}`,
          message: "Offered A Draw",
          className: "game-message",
        },
      });
      socket.emit("sendDrawOffer");
    }
  };

  const handleExit = () => {
    const width = document.querySelector(".board-container").offsetWidth;
    socket.emit("exitGame");
    dispatch({ type: "resetBoardState", value: width });
    dispatch({ type: "resetGameState" });
  };

  return (
    <Col
      md={{ span: 4 }}
      xs={{ span: 10 }}
      className="game-controller mb-3 game-bar-controller"
    >
      <div className="button-container game-bar">
        <div className="select-side-container">
          <Button
            className="red-side draw-btn"
            value="draw"
            onClick={handleOfferDraw}
            disabled={gameResult !== null || pause}
          >
            &#189; Draw
          </Button>
          <Button
            className="black-side resign-btn"
            value="resign"
            onClick={props.handleResign}
            disabled={gameResult !== null || pause}
          >
            <i className="fas fa-flag"></i> Resign
          </Button>
        </div>
        <div className="time-select-container">
          <Button
            className="select-timer pause-btn"
            disabled={gameResult !== null || (pause && !/Paused/.test(pause))}
            id={!pause ? "Pause" : "Resume"}
            onClick={handlePauseOrResume}
          >
            <i className={`fas fa-${!pause ? "pause" : "play"}`}></i>{" "}
            {!pause ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>
      <ChatSection />
      <Button
        className="exit-game"
        disabled={gameResult === null}
        onClick={handleExit}
      >
        Exit Game
      </Button>
      <Button className="center-board" onClick={props.handleCenterBoard}>
        {`Center Board: ${props.centerBoard ? "On" : "Off"}`}
      </Button>
    </Col>
  );
};

export default GameBar;
