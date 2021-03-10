import React from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080/play");
const timer = new Worker("/web_worker_timer/webWorkerTimer.js");

const setTimer = (playerTurn, gameFinish, dispatch) => {
  if (gameFinish) {
    timer.postMessage(false);
    dispatch({ type: "setOpponentTimeLeftToMove", value: "restart" });
    dispatch({ type: "setPlayerTimeLeftToMove", value: "restart" });
    dispatch({ type: "setTurnToMove", value: false });
    return;
  }
  if (playerTurn)
    dispatch({ type: "setOpponentTimeLeftToMove", value: "restart" });
  else dispatch({ type: "setPlayerTimeLeftToMove", value: "restart" });
  timer.postMessage(true);
  timer.onmessage = (_) => {
    if (playerTurn) dispatch({ type: "setPlayerTimeLeftToMove", value: null });
    else dispatch({ type: "setOpponentTimeLeftToMove", value: null });
  };
};

const SocketContext = React.createContext();
const TimerContext = React.createContext();
const SetTimerContext = React.createContext();

export {
  SocketContext,
  TimerContext,
  SetTimerContext,
  setTimer,
  socket,
  timer,
};
