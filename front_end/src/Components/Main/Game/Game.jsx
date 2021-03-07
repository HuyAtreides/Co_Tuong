import React, { useState, useEffect } from "react";
import "./Game.scss";
import { Row } from "react-bootstrap";
import GameController from "./GameController/GameController.jsx";
import GamePlayArea from "./GamePlayArea/GamePlayArea.jsx";
import { useSelector, useDispatch } from "react-redux";
import GameBar from "./GameBar/GameBar.jsx";

const Game = () => {
  const [timeSelectorDisplay, setTimeSelectorDisplay] = useState("none");
  const foundMatch = useSelector((state) => state.gameState.foundMatch);
  const handleToggle = () => {
    setTimeSelectorDisplay(timeSelectorDisplay === "none" ? "flex" : "none");
  };

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
