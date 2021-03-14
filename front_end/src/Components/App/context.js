import React from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080/play");
const SocketContext = React.createContext();
const SetMoveTimerContext = React.createContext();

const setMoveTimer = (playerTurn, gameFinish, dispatch) => {
  socket.removeAllListeners("oneSecondPass");
  if (gameFinish) {
    socket.emit("setTimer", false);
    dispatch({ type: "setPause", value: null });
    dispatch({ type: "setPauseTime", value: "restart" });
    dispatch({ type: "setOpponentTimeLeftToMove", value: "restart" });
    dispatch({ type: "setPlayerTimeLeftToMove", value: "restart" });
    dispatch({ type: "setTurnToMove", value: false });
    return;
  }
  if (playerTurn)
    dispatch({ type: "setOpponentTimeLeftToMove", value: "restart" });
  else dispatch({ type: "setPlayerTimeLeftToMove", value: "restart" });
  socket.emit("startTimer", true);
  socket.on("oneSecondPass", () => {
    if (playerTurn) dispatch({ type: "setPlayerTimeLeftToMove", value: null });
    else dispatch({ type: "setOpponentTimeLeftToMove", value: null });
  });
};

export { SocketContext, SetMoveTimerContext, setMoveTimer, socket };
