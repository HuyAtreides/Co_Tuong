import React, { useContext, useEffect, useState } from "react";
import { Col, Button } from "react-bootstrap";
import "./GameController.scss";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext, SetMoveTimerContext } from "../../../App/context.js";
import PlayWithFriend from "./PlayWithFriend/PlayWithFriend.jsx";

const GameController = (props) => {
  const dispatch = useDispatch();
  const [playWithFriend, setPlayWithFriend] = useState(false);
  const socket = useContext(SocketContext);
  const setMoveTimer = useContext(SetMoveTimerContext);
  const findingMatch = useSelector((state) => state.gameState.findingMatch);
  const time = useSelector((state) => state.gameState.time);
  const side = useSelector((state) => state.boardState.side);

  const handlePlayWithFriend = () => {
    setPlayWithFriend(!playWithFriend);
  };

  const handlePlay = () => {
    if (findingMatch !== true) {
      socket.emit("findMatch", side, time);
      dispatch({ type: "setFindingMatch", value: true });
    }
  };

  const handleSelectTime = (event) => {
    const selectedTime = +event.currentTarget.getAttribute("value");
    dispatch({ type: "setTime", value: selectedTime });
    props.handleToggle();
  };

  const handleSwitchSide = (event) => {
    const selectedSide = event.currentTarget.getAttribute("value");
    if (selectedSide === "black")
      dispatch({ type: "switchSide", value: ["red", "black"] });
    else dispatch({ type: "switchSide", value: ["black", "red"] });
  };

  useEffect(() => {
    socket.on("timeout", () => {
      dispatch({
        type: "setFindingMatch",
        value: "No Players are currently online :(",
      });
    });

    socket.on("foundMatch", (opponent, firstMove, time) => {
      dispatch({
        type: "setOpponentInfo",
        value: {
          playername: opponent.playername,
          photo: opponent.photo,
        },
      });
      dispatch({ type: "setTime", value: time });
      dispatch({ type: "setTurnToMove", value: firstMove });
      dispatch({ type: "setFoundMatch", value: true });
      setMoveTimer(firstMove, false, dispatch);
    });

    socket.on("isInGame", () => {
      dispatch({
        type: "setFindingMatch",
        value:
          "Your account is currently in a game. Please try again after the game was finished",
      });
    });

    return () => {
      socket.removeAllListeners("timeout");
      socket.removeAllListeners("foundMatch");
    };
  });

  return (
    <Col md={{ span: 4 }} xs={{ span: 10 }} className="game-controller mb-3">
      {!playWithFriend ? (
        <div className="button-container">
          <div className="select-side-container">
            <Button
              className="red-side"
              value="red"
              onClick={handleSwitchSide}
              disabled={findingMatch === true}
            >
              Red
            </Button>
            <Button
              className="black-side"
              value="black"
              onClick={handleSwitchSide}
              disabled={findingMatch === true}
            >
              Black
            </Button>
          </div>
          <div className="time-select-container">
            <Button
              className="select-timer"
              onClick={props.handleToggle}
              disabled={findingMatch === true}
            >
              <i className="fas fa-clock"></i> {time + ":00"}{" "}
              <i className="fas fa-angle-down"></i>
            </Button>
            <div
              className="time-select-table"
              style={{ display: props.timeSelectorDisplay }}
            >
              <Button onClick={handleSelectTime} value="1">
                1 min
              </Button>
              <Button onClick={handleSelectTime} value="3">
                3 min
              </Button>
              <Button onClick={handleSelectTime} value="5">
                5 min
              </Button>
              <Button onClick={handleSelectTime} value="10">
                10 min
              </Button>
              <Button onClick={handleSelectTime} value="15">
                15 min
              </Button>
              <Button onClick={handleSelectTime} value="30">
                30 min
              </Button>
            </div>
          </div>
          <Button
            className={`play ${
              findingMatch === true ? "finding-opponent" : ""
            }`}
            onClick={handlePlay}
          >
            {findingMatch === true ? "Finding Opponent..." : findingMatch}
          </Button>
          <Button
            className="play-with-friend"
            disabled={findingMatch === true}
            onClick={handlePlayWithFriend}
          >
            Play With Friend
          </Button>
          <Button className="center-board" onClick={props.handleCenterBoard}>
            {`Center Board: ${props.centerBoard ? "On" : "Off"}`}
          </Button>
        </div>
      ) : (
        <PlayWithFriend return={handlePlayWithFriend} />
      )}
    </Col>
  );
};

export default GameController;
