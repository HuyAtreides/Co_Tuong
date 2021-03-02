import React, { useState } from "react";
import "./Game.scss";
import { Row } from "react-bootstrap";
import GameController from "./GameController/GameController.jsx";
import GamePlayArea from "./GamePlayArea/GamePlayArea.jsx";
import { useSelector } from "react-redux";

const Game = (props) => {
  const [timeSelectorDisplay, setTimeSelectorDisplay] = useState("none");
  const [time, setTime] = useState(10);
  const [timeLeftToMove, setTimeLeftToMove] = useState(10);
  // const turnToMove = useSelector((state) => state.boardState.turnToMove);
  const handleToggle = () => {
    setTimeSelectorDisplay(timeSelectorDisplay === "none" ? "flex" : "none");
  };

  const handleSelectTime = (event) => {
    const selectedTime = event.currentTarget.getAttribute("value");
    setTime(selectedTime);
    setTimeLeftToMove(+selectedTime);
    handleToggle();
  };

  return (
    <Row md={{ cols: 1 }} className="mt-5 pb-5">
      <GamePlayArea timeLeftToMove={timeLeftToMove} />
      <GameController
        time={time}
        handleSelectTime={handleSelectTime}
        timeSelectorDisplay={timeSelectorDisplay}
        handleToggle={handleToggle}
      />
    </Row>
  );
};

export default Game;
