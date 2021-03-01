import React, { useState } from "react";
import "./Timer.scss";

const Timer = (props) => {
  return (
    <div className="clock">
      <span>{props.timeLeftToMove + ":00"}</span>
    </div>
  );
};

export default Timer;
