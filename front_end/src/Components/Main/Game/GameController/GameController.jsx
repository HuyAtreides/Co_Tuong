import React from "react";
import { Col, Button } from "react-bootstrap";
import "./GameController.scss";
import { useDispatch, useSelector } from "react-redux";

const GameController = (props) => {
  const dispatch = useDispatch();
  const findingMatch = useSelector((state) => state.gameState.findingMatch);
  const time = useSelector((state) => state.gameState.time);

  const handlePlay = () => {
    if (!findingMatch) dispatch({ type: "setFindingMatch", value: true });
  };

  const handleSelectTime = (event) => {
    const selectedTime = +event.currentTarget.getAttribute("value");
    dispatch({ type: "setTime", value: selectedTime });
    dispatch({ type: "setOpponentTimeLeftToMove", value: selectedTime * 60 });
    dispatch({ type: "setPlayerTimeLeftToMove", value: selectedTime * 60 });
    props.handleToggle();
  };

  const handleSwitchSide = (event) => {
    const selectedSide = event.currentTarget.getAttribute("value");
    if (selectedSide === "black")
      dispatch({ type: "switchSide", value: ["red", "black"] });
    else dispatch({ type: "switchSide", value: ["black", "red"] });
  };

  return (
    <Col md={{ span: 4 }} xs={{ span: 10 }} className="game-controller mb-3">
      <div className="button-container">
        <div className="select-side-container">
          <Button
            className="red-side"
            value="red"
            onClick={handleSwitchSide}
            disabled={findingMatch}
          >
            Red
          </Button>
          <Button
            className="black-side"
            value="black"
            onClick={handleSwitchSide}
            disabled={findingMatch}
          >
            Black
          </Button>
        </div>
        <div className="time-select-container">
          <Button
            className="select-timer"
            onClick={props.handleToggle}
            disabled={findingMatch}
          >
            <i className="fas fa-clock"></i> {time + ":00"}{" "}
            <i className="fas fa-angle-down"></i>
          </Button>
          <div
            className="time-select-table"
            style={{ display: props.timeSelectorDisplay }}
          >
            <Button className="1-min" onClick={handleSelectTime} value="1">
              1 min
            </Button>
            <Button className="3-min" onClick={handleSelectTime} value="3">
              3 min
            </Button>
            <Button className="5-min" onClick={handleSelectTime} value="5">
              5 min
            </Button>
            <Button className="10-min" onClick={handleSelectTime} value="10">
              10 min
            </Button>
          </div>
        </div>
        <Button
          className={`play ${findingMatch ? "finding-opponent" : ""}`}
          onClick={handlePlay}
        >
          {findingMatch
            ? "Finding Opponent..."
            : findingMatch === null
            ? "No Players Are Currently Online :("
            : "Play"}
        </Button>
        <Button className="play-with-friend" disabled={findingMatch}>
          Play With Friend
        </Button>
      </div>
    </Col>
  );
};

export default GameController;