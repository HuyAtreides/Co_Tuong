import React, { useState } from "react";
import "./Timer.scss";
import { useSelector } from "react-redux";

const Timer = (props) => {
  const minute = Math.floor(props.timeLeftToMove / 60);
  const second = props.timeLeftToMove % 60;
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
