import React from "react";
import { io } from "socket.io-client";

const socket = io("https://www.cotuong.tk/play", {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
  rememberUpgrade: true,
});
const SocketContext = React.createContext();
const SetMoveTimerContext = React.createContext();
const AuthenticateUserContext = React.createContext();

const authenticateUser = (dispatch, user, opponentID) => {
  if (socket.guest) socket.disconnect();
  socket.guest = user.guest;

  dispatch({ type: "resetBoardState", value: 520 });
  dispatch({ type: "resetGameState" });
  dispatch({ type: "setIsAuthenticated", value: !user.guest ? true : "guest" });
  dispatch({ type: "setPlayerInfo", value: user });

  if (user.lang) dispatch({ type: "setLang", value: user.lang });
  socket.auth = {
    player: {
      playername: user.username,
      guest: user.guest,
      photo: user.photo,
    },
    opponentID: opponentID,
  };
  socket.connect();
};

const setMoveTimer = (playerTurn, gameFinish, dispatch) => {
  socket.removeAllListeners("oneSecondPass");
  if (gameFinish) {
    dispatch({ type: "setPause", value: null });
    dispatch({ type: "setPauseTime", value: "restart" });
    dispatch({ type: "setOpponentTimeLeftToMove", value: "restart" });
    dispatch({ type: "setPlayerTimeLeftToMove", value: "restart" });
    dispatch({ type: "setTurnToMove", value: false });
  } else {
    if (playerTurn)
      dispatch({ type: "setOpponentTimeLeftToMove", value: "restart" });
    else dispatch({ type: "setPlayerTimeLeftToMove", value: "restart" });
    socket.emit("startTimer", true);
    socket.on("oneSecondPass", () => {
      if (playerTurn)
        dispatch({ type: "setPlayerTimeLeftToMove", value: null });
      else dispatch({ type: "setOpponentTimeLeftToMove", value: null });
    });
  }
};

export {
  SocketContext,
  SetMoveTimerContext,
  setMoveTimer,
  socket,
  AuthenticateUserContext,
  authenticateUser,
};
