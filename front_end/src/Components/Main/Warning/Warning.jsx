import React, { useState } from "react";
import "./Warning.scss";

const Warning = (props) => {
  const [display, setDisplay] = useState("flex");

  return (
    <div className="warning" style={{ display: display }}>
      <div className="warning-icon">
        <i className="fas fa-exclamation-triangle fa-2x"></i>
      </div>
      <p>{props.connectionError}</p>
      <i
        className="fas fa-times"
        onClick={() => {
          setDisplay("none");
        }}
      ></i>
    </div>
  );
};

export default Warning;
