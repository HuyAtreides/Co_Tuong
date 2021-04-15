import React, { useContext, useEffect, useState } from "react";
import { Col, Button } from "react-bootstrap";
import PlayButton from "./PlayButton/PlayButton.jsx";
import "./GameController.scss";
import { useDispatch, useSelector, useStore } from "react-redux";
import { SocketContext, SetMoveTimerContext } from "../../../App/context.js";
import PlayWithFriend from "./PlayWithFriend/PlayWithFriend.jsx";

const GameController = (props) => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.appState.lang);
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
      setPlayWithFriendText(
        lang === "English" ? "Connection Was Closed" : "Kết nối đã đóng"
      );
      setTimeout(() => {
        setPlayWithFriendText("Play With Friend");
      }, 700);
    } else setPlayWithFriend(!playWithFriend);
  };

  const handlePlay = () => {
    if (!socket.connected) {
      dispatch({
        type: "setFindingMatch",
        value: lang === "English" ? "Connection Was Closed" : "Kết nối đã đóng",
      });
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
    props.handleToggle();
  };

  const handleSwitchSide = (event) => {
    const selectedSide = event.currentTarget.getAttribute("value");
    if (selectedSide === "black") {
      dispatch({ type: "switchSide", value: ["red", "black"] });
      socket.emit("setTimeAndSide", +time, "black");
    } else {
      dispatch({ type: "switchSide", value: ["black", "red"] });
    }
  };

  useEffect(() => {
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
      dispatch({ type: "setFindingMatch", value: "Play" });
    });

    return () => {
      socket.emit("cancelFindMatch");
    };
  }, []);

  useEffect(() => {
    setPlayWithFriendText(
      lang === "English" ? "Play With Friend" : "Chơi Với Bạn"
    );
    dispatch({
      type: "setFindingMatch",
      value: lang === "English" ? "Play" : "Chơi",
    });
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
              {lang === "English" ? "Red" : "Đỏ"}
            </Button>
            <Button
              className="black-side"
              value="black"
              onClick={handleSwitchSide}
              disabled={findingMatch === true || findingMatch === "Waiting..."}
            >
              {lang === "English" ? "Black" : "Đen"}
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
                1 {lang === "English" ? "min" : "phút"}
              </Button>
              <Button onClick={handleSelectTime} value="3">
                3 {lang === "English" ? "min" : "phút"}
              </Button>
              <Button onClick={handleSelectTime} value="5">
                5 {lang === "English" ? "min" : "phút"}
              </Button>
              <Button onClick={handleSelectTime} value="10">
                10 {lang === "English" ? "min" : "phút"}
              </Button>
              <Button onClick={handleSelectTime} value="15">
                15 {lang === "English" ? "min" : "phút"}
              </Button>
              <Button onClick={handleSelectTime} value="30">
                30 {lang === "English" ? "min" : "phút"}
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
            {lang === "English"
              ? `Center Board: ${props.centerBoard ? "On" : "Off"}`
              : `Canh Giữa Bàn Cờ:  ${props.centerBoard ? "Bật" : "Tắt"}`}
          </Button>
        </div>
      ) : (
        <PlayWithFriend return={handlePlayWithFriend} />
      )}
    </Col>
  );
};

export default GameController;
