import { io } from "socket.io-client";

const gameReducer = (
  state = {
    lang: "English",
    currentIntervalID: null,
    isAuthenticated: false,
    playerInfo: null,
  },
  action
) => {
  const newState = Object.assign({}, state);
  const { type, value } = action;
  switch (type) {
    case "setPlayerInfo":
      newState.playerInfo = value;
      return newState;
    case "setLang":
      newState.lang = value;
      return newState;
    case "setCurrentIntervalID":
      newState.currentIntervalID = value;
      return newState;
    case "setIsAuthenticated":
      newState.isAuthenticated = value;
      return newState;
    default:
      return state;
  }
};

export default gameReducer;
