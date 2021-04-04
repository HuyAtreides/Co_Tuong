import React, { useState, useEffect, useContext } from "react";
import "./Game.scss";
import { Row } from "react-bootstrap";
import GameController from "./GameController/GameController.jsx";
import GamePlayArea from "./GamePlayArea/GamePlayArea.jsx";
import { useSelector, useDispatch, useStore } from "react-redux";
import GameBar from "./GameBar/GameBar.jsx";
import { SocketContext, SetMoveTimerContext } from "../../App/context.js";

const Game = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const setMoveTimer = useContext(SetMoveTimerContext);
  const [timeSelectorDisplay, setTimeSelectorDisplay] = useState("none");
  const foundMatch = useSelector((state) => state.gameState.foundMatch);
  const store = useStore();
  const [centerBoard, setCenterBoard] = useState(false);

  const handleCenterBoard = () => {
    setCenterBoard(!centerBoard);
  };

  const handleToggle = () => {
    setTimeSelectorDisplay(timeSelectorDisplay === "none" ? "flex" : "none");
  };

  useEffect(() => {
    return () => {
      const foundMatch = store.getState().gameState.foundMatch;
      const result = store.getState().gameState.result;
      if (foundMatch && !result) {
        console.log("?");
        dispatch({ type: "setGameResult", value: "Lose" });
        dispatch({
          type: "setMessage",
          value: {
            type: "game result message",
            winner: "Opponent Won - ",
            reason: "Game Abandoned",
            className: "game-message",
          },
        });
        setMoveTimer(null, true, dispatch);
        socket.emit("gameFinish", ["Won", "Game Abandoned"]);
      }
    };
  }, []);

  return (
    <Row md={{ cols: 1 }} className="mt-3 pb-3">
      <GamePlayArea />
      <div
        className="w-100"
        style={{ display: centerBoard ? "block" : "none" }}
      ></div>
      {!foundMatch ? (
        <GameController
          timeSelectorDisplay={timeSelectorDisplay}
          handleToggle={handleToggle}
          handleCenterBoard={handleCenterBoard}
          centerBoard={centerBoard}
        />
      ) : (
        <GameBar
          handleCenterBoard={handleCenterBoard}
          centerBoard={centerBoard}
        />
      )}
    </Row>
  );
};

export default Game;
