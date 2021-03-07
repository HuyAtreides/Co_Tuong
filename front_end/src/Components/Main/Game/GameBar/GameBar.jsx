import React from "react";
import { Col, Button } from "react-bootstrap";
import "./GameBar.scss";
import { useDispatch, useSelector } from "react-redux";
import ChatSection from "./ChatSection/ChatSection.jsx";
import { io } from "socket.io-client";

const GameBar = () => {
  const dispatch = useDispatch();
  const receiveDrawOffer = useSelector(
    (state) => state.gameState.receiveDrawOffer
  );
  const gameResult = useSelector((state) => state.gameState.gameResult);
  const socket = useSelector((state) => state.appState.socket);

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
    const listItemRef = React.createRef();
    dispatch({ type: "setGameResult", value: "Lose" });
    dispatch({ type: "setSendGameResult", value: ["Won", "Opponent Resign"] });
    dispatch({
      type: "setMessage",
      value: {
        type: "game result message",
        winner: "Opponent Won - ",
        reason: "Opponent Resign",
        className: "game-message",
        ref: listItemRef,
      },
    });
  };

  const handleExit = () => {
    const width = document.querySelector(".board-container").offsetWidth;
    socket.disconnect();
    dispatch({ type: "resetBoardState", value: width });
    dispatch({ type: "resetGameState" });
    dispatch({ type: "setCurrentTimerID", value: null });
    dispatch({ type: "setSocket", value: io("http://localhost:8080/play") });
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
            disabled={gameResult !== null}
          >
            &#189; Draw
          </Button>
          <Button
            className="black-side resign-btn"
            value="resign"
            onClick={handleResign}
            disabled={gameResult !== null}
          >
            <i className="fas fa-flag"></i> Resign
          </Button>
        </div>
        <div className="time-select-container">
          <Button
            className="select-timer pause-btn"
            disabled={gameResult !== null}
          >
            <i className="fas fa-pause"></i> Pause
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
