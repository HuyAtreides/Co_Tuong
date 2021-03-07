import React, { useEffect } from "react";
import "./Timer.scss";
import { useDispatch } from "react-redux";

const Timer = (props) => {
  const dispatch = useDispatch();
  const minute = Math.floor(props.timeLeftToMove / 60);
  const second = props.timeLeftToMove % 60;

  useEffect(() => {
    if (props.timeLeftToMove === 0) {
      const listItemRef = React.createRef();
      dispatch({ type: "setGameResult", value: "Lose" });
      dispatch({ type: "setSendGameResult", value: ["Won", "Game Abandoned"] });
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
