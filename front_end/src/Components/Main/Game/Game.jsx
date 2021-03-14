import React, { useState, useEffect, useContext, useRef } from "react";
import "./Game.scss";
import { Row } from "react-bootstrap";
import GameController from "./GameController/GameController.jsx";
import GamePlayArea from "./GamePlayArea/GamePlayArea.jsx";
import { useSelector, useDispatch } from "react-redux";
import GameBar from "./GameBar/GameBar.jsx";
import { SocketContext, SetMoveTimerContext } from "../../App/context.js";

const Game = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const setMoveTimer = useContext(SetMoveTimerContext);
  const [timeSelectorDisplay, setTimeSelectorDisplay] = useState("none");
  const foundMatch = useSelector((state) => state.gameState.foundMatch);
  const foundMatchRef = useRef();

  const handleToggle = () => {
    setTimeSelectorDisplay(timeSelectorDisplay === "none" ? "flex" : "none");
  };

  useEffect(() => {
    foundMatchRef.current = foundMatch;
  }, [foundMatch]);

  useEffect(() => {
    return () => {
      if (foundMatchRef.current) {
        const listItemRef = React.createRef();
        dispatch({ type: "setGameResult", value: "Lose" });
        dispatch({
          type: "setMessage",
          value: {
            type: "game result message",
            winner: "Opponent Won - ",
            reason: "Game Abandoned",
            className: "game-message",
            ref: listItemRef,
          },
        });
        setMoveTimer(null, true, dispatch);
        socket.emit("gameFinish", ["Won", "Game Abandoned"]);
      }
    };
  }, []);

  return (
    <Row md={{ cols: 1 }} className="mt-5 pb-5">
      <GamePlayArea />
      {!foundMatch ? (
        <GameController
          timeSelectorDisplay={timeSelectorDisplay}
          handleToggle={handleToggle}
        />
      ) : (
        <GameBar />
      )}
    </Row>
  );
};

export default Game;
