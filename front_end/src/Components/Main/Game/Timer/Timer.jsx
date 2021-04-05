import React, { useEffect, useContext } from "react";
import "./Timer.scss";
import { useDispatch, useSelector, useStore } from "react-redux";
import { SocketContext, SetMoveTimerContext } from "../../../App/context.js";

const Timer = (props) => {
  const dispatch = useDispatch();
  const store = useStore();
  const minute = Math.floor(props.timeLeftToMove / 60);
  const second = props.timeLeftToMove % 60;
  const socket = useContext(SocketContext);
  const setMoveTimer = useContext(SetMoveTimerContext);
  const turnToMove = useSelector((state) => state.boardState.turnToMove);

  useEffect(() => {
    if (props.timeLeftToMove <= 0 && turnToMove) {
      const opponent = store.getState().gameState.opponentInfo;
      dispatch({ type: "setGameResult", value: "Lose" });
      dispatch({
        type: "setMessage",
        value: {
          type: "game result message",
          winner: `${opponent.playername} Won - `,
          reason: "Game Abandoned",
          className: "game-message",
        },
      });
      setMoveTimer(null, true, dispatch);
      socket.emit("gameFinish", ["Won", "Game Abandoned"]);
    }
  }, [turnToMove, props.timeLeftToMove]);

  return (
    <div
      className={`clock ${
        props.turnToMove && socket.connected ? "turn-to-move" : ""
      }`}
    >
      <span>
        {(minute < 10 ? "0" + minute : minute) +
          ":" +
          (second < 10 ? "0" + second : second)}
      </span>
    </div>
  );
};

export default Timer;
