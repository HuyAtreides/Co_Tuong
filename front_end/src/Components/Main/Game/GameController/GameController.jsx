import React, { useContext, useEffect, useState } from "react";
import { Col, Button } from "react-bootstrap";
import PlayButton from "./PlayButton/PlayButton.jsx";
import "./GameController.scss";
import { useDispatch, useSelector, useStore } from "react-redux";
import { SocketContext, SetMoveTimerContext } from "../../../App/context.js";
import PlayWithFriend from "./PlayWithFriend/PlayWithFriend.jsx";

const GameController = (props) => {
  const dispatch = useDispatch();
  const [playWithFriendText, setPlayWithFriendText] = useState(
    "Play With Friend"
  );
  const [playWithFriend, setPlayWithFriend] = useState(false);
  const socket = useContext(SocketContext);
  const setMoveTimer = useContext(SetMoveTimerContext);
  const findingMatch = useSelector((state) => state.gameState.findingMatch);
  const time = useSelector((state) => state.gameState.time);
  const side = useSelector((state) => state.boardState.side);

  const handlePlayWithFriend = () => {
    if (!socket.connected) {
      setPlayWithFriendText("Connection Was Closed");
      setTimeout(() => {
        setPlayWithFriendText("Play With Friend");
      }, 700);
    } else setPlayWithFriend(!playWithFriend);
  };

  const handlePlay = () => {
    if (!socket.connected) {
      dispatch({ type: "setFindingMatch", value: "Connection Was Closed" });
      setTimeout(() => {
        dispatch({ type: "setFindingMatch", value: "Play" });
      }, 700);
    } else if (findingMatch !== true) {
      socket.emit("setTimeAndSide", +time, side[1], () => {
        socket.emit("findMatch");
        dispatch({ type: "setFindingMatch", value: true });
      });
    } else if (findingMatch === true) socket.emit("cancelFindMatch");
  };

  const handleSelectTime = (event) => {
    const selectedTime = +event.currentTarget.getAttribute("value");
    dispatch({ type: "setTime", value: selectedTime });
    socket.emit("setTimeAndSide", selectedTime, side[1]);
    props.handleToggle();
  };

  const handleSwitchSide = (event) => {
    const selectedSide = event.currentTarget.getAttribute("value");
    if (selectedSide === "black") {
      dispatch({ type: "switchSide", value: ["red", "black"] });
      socket.emit("setTimeAndSide", +time, "black");
    } else {
      dispatch({ type: "switchSide", value: ["black", "red"] });
      socket.emit("setTimeAndSide", +time, "red");
    }
  };

  useEffect(() => {
    socket.emit("setTimeAndSide", +time, side[1]);
    socket.on("timeout", () => {
      dispatch({
        type: "setFindingMatch",
        value: "No Players are currently online :(",
      });
    });

    socket.on("foundMatch", (opponent, firstMove, time) => {
      dispatch({ type: "setFoundMatch", value: true });
      dispatch({
        type: "setOpponentInfo",
        value: {
          playername: opponent.playername,
          photo: opponent.photo,
        },
      });

      dispatch({ type: "setTime", value: time });
      dispatch({ type: "setTurnToMove", value: firstMove });
      setMoveTimer(firstMove, false, dispatch);
    });

    socket.on("findMatchCanceled", () => {
      dispatch({ type: "setFindingMatch", value: "play" });
    });

    return () => {
      socket.emit("cancelFindMatch");
    };
  }, []);

  return (
    <Col md={{ span: 4 }} xs={{ span: 10 }} className="game-controller mb-3">
      {!playWithFriend ? (
        <div className="button-container">
          <div className="select-side-container">
            <Button
              className="red-side"
              value="red"
              onClick={handleSwitchSide}
              disabled={findingMatch === true || findingMatch === "Waiting..."}
            >
              Red
            </Button>
            <Button
              className="black-side"
              value="black"
              onClick={handleSwitchSide}
              disabled={findingMatch === true || findingMatch === "Waiting..."}
            >
              Black
            </Button>
          </div>
          <div className="time-select-container">
            <Button
              className="select-timer"
              onClick={props.handleToggle}
              disabled={findingMatch === true || findingMatch === "Waiting..."}
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
          <PlayButton findingMatch={findingMatch} handlePlay={handlePlay} />

          <Button
            className="play-with-friend"
            disabled={findingMatch === true || findingMatch === "Waiting..."}
            onClick={handlePlayWithFriend}
          >
            {playWithFriendText}
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
