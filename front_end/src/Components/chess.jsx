import React, { useState, useEffect } from "react";
import "./chess.scss";
import Board from "./board.jsx";

function Chess(props) {
  return <Board side={["red", "black"]} />;
}

export default Chess;
