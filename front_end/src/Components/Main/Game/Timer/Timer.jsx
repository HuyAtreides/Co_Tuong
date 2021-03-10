import React, { useEffect, useContext } from "react";
import "./Timer.scss";
import { useDispatch, useSelector } from "react-redux";
import { SocketContext, SetTimerContext } from "../../../App/context.js";

const Timer = (props) => {
  const dispatch = useDispatch();
  const minute = Math.floor(props.timeLeftToMove / 60);
  const second = props.timeLeftToMove % 60;
  const socket = useContext(SocketContext);
  const setTimer = useContext(SetTimerContext);
  const turnToMove = useSelector((state) => state.boardState.turnToMove);

  useEffect(() => {
    if (props.timeLeftToMove === 0 && turnToMove) {
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
      setTimer(null, true, dispatch);
      socket.emit("gameFinish", ["Won", "Game Abandoned"]);
    }
  }, [props.timeLeftToMove]);

  return (
    <div className={`clock ${props.turnToMove ? "turn-to-move" : ""}`}>
      <span>
        {(minute < 10 ? "0" + minute : minute) +
          ":" +
          (second < 10 ? "0" + second : second)}
      </span>
    </div>
  );
};

export default Timer;
