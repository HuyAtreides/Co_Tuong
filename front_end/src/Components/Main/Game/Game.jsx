import React, { useState } from "react";
import "./Game.scss";
import Board from "./Board/Board";
import { Row, Col } from "react-bootstrap";
import Timer from "./Timer/Timer.jsx";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";

const Game = (props) => {
  const [timeSelectorDisplay, setTimeSelectorDisplay] = useState("none");
  const [time, setTime] = useState(10);
  const [timeLeftToMove, setTimeLeftToMove] = useState(10);
  const dispatch = useDispatch();

  const handleSwitchSide = (event) => {
    const selectedSide = event.currentTarget.getAttribute("value");
    if (selectedSide === "black")
      dispatch({ type: "switchSide", value: ["red", "black"] });
    else dispatch({ type: "switchSide", value: ["black", "red"] });
  };

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
    <Row md={{ cols: 2 }} className="mt-5">
      <Col
        md={{ span: 4 }}
        sm={{ span: 11 }}
        xs={{ span: 11 }}
        className="board-container"
      >
        <div className="player-area">
          <div className="avatar-and-name">
            <img
              src="https://betacssjs.chesscomfiles.com/bundles/web/images/black_400.918cdaa6.png"
              alt=""
            />
            <p className="user-name">Opponent</p>
          </div>
          <Timer timeLeftToMove={timeLeftToMove} />
        </div>
        <Board />
        <div className="player-area">
          <div className="avatar-and-name">
            <div className="avatar-and-name">
              <img src="/user_profile_pic/P.svg" alt="" />
              <p className="user-name">Phan Gia Huy</p>
            </div>
          </div>
          <Timer timeLeftToMove={timeLeftToMove} />
        </div>
      </Col>
      <Col md={{ span: 4 }} xs={{ span: 10 }} className="game-controller">
        <div className="button-container">
          <div className="select-side-container">
            <Button className="red-side" value="red" onClick={handleSwitchSide}>
              Red
            </Button>
            <Button
              className="black-side"
              value="black"
              onClick={handleSwitchSide}
            >
              Black
            </Button>
          </div>
          <div className="time-select-container">
            <Button className="select-timer" onClick={handleToggle}>
              <i className="fas fa-clock"></i> {time + ":00"}{" "}
              <i className="fas fa-angle-down"></i>
            </Button>
            <div
              className="time-select-table"
              style={{ display: timeSelectorDisplay }}
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
          <Button className="play">Play</Button>
          <Button className="play-with-friend">Play With Friend</Button>
        </div>
      </Col>
    </Row>
  );
};

export default Game;
