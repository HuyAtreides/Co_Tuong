import React, { useContext, useEffect } from "react";
import { Col, Button } from "react-bootstrap";
import "./GameBar.scss";
import { useDispatch, useSelector } from "react-redux";
import ChatSection from "./ChatSection/ChatSection.jsx";
import { SocketContext, SetMoveTimerContext } from "../../../App/context.js";

const GameBar = () => {
  const dispatch = useDispatch();
  const receiveDrawOffer = useSelector(
    (state) => state.gameState.receiveDrawOffer
  );
  const gameResult = useSelector((state) => state.gameState.gameResult);
  const socket = useContext(SocketContext);
  const setMoveTimer = useContext(SetMoveTimerContext);
  const pause = useSelector((state) => state.gameState.pause);

  const handleResume = () => {
    const listItemRef = React.createRef();
    const message = {
      from: "Phan Gia Huy",
      message: "Resumed Game",
      className: "game-message",
      ref: listItemRef,
    };
    dispatch({ type: "setMessage", value: message });
    dispatch({ type: "setPause", value: "Phan Gia Huy Resumed Game" });
    socket.emit("playerResumeGame");
  };

  const handlePause = () => {
    const listItemRef = React.createRef();
    const message = {
      from: "Phan Gia Huy",
      message: "Paused Game",
      className: "game-message",
      ref: listItemRef,
    };
    dispatch({ type: "setMessage", value: message });
    dispatch({ type: "setPause", value: "Phan Gia Huy Paused Game" });
    socket.emit("playerPauseGame");
  };

  const handleGameOver = (result, reason) => {
    const listItemRef = React.createRef();
    dispatch({ type: "setGameResult", value: result });
    dispatch({
      type: "setMessage",
      value: {
        type: "game result message",
        winner: `${result === "Won" ? "Phan Gia Huy" : "Opponent"} Won  `,
        reason: reason,
        className: "game-message",
        ref: listItemRef,
      },
    });
    setMoveTimer(null, true, dispatch);
  };

  const handleOfferDraw = () => {
    if (!receiveDrawOffer) {
      const listItemRef = React.createRef();
      dispatch({
        type: "setMessage",
        value: {
          from: "You",
          message: "Offered A Draw",
          className: "game-message",
          ref: listItemRef,
        },
      });
      socket.emit("sendDrawOffer");
    }
  };

  const handleResign = () => {
    handleGameOver("Lose", "Phan Gia Huy Resign");
    socket.emit("gameFinish", ["Won", "Opponent Resign"]);
  };

  useEffect(() => {
    socket.on("gameOver", (result, reason) => {
      if (gameResult !== null) return;
      handleGameOver(result, reason);
    });

    return () => {
      socket.removeAllListeners("gameOver");
    };
  });

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
            onClick={handleResign}
            disabled={gameResult !== null || pause}
          >
            <i className="fas fa-flag"></i> Resign
          </Button>
        </div>
        <div className="time-select-container">
          <Button
            className="select-timer pause-btn"
            disabled={gameResult !== null || (pause && !/Paused/.test(pause))}
            onClick={!pause ? handlePause : handleResume}
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
    </Col>
  );
};

export default GameBar;
