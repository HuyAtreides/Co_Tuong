import React from "react";
import { io } from "socket.io-client";

const socket = io("http://192.168.1.6:8080/play", { autoConnect: false });
const SocketContext = React.createContext();
const SetMoveTimerContext = React.createContext();
const AuthenticateUserContext = React.createContext();

const authenticateUser = (dispatch, user) => {
  if (socket.guest) socket.disconnect();
  socket.guest = user.guest;
  dispatch({ type: "setPlayerInfo", value: user });
  dispatch({ type: "setIsAuthenticated", value: !user.guest ? true : "guest" });
  if (user.lang) dispatch({ type: "setLang", value: user.lang });
  dispatch({ type: "resetGameState" });
  dispatch({ type: "resetBoardState", value: 520 });
  socket.auth = {
    player: {
      playername: user.username,
      guest: user.guest,
      photo: user.photo,
    },
  };
  socket.connect();
};

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

export {
  SocketContext,
  SetMoveTimerContext,
  setMoveTimer,
  socket,
  AuthenticateUserContext,
  authenticateUser,
};
