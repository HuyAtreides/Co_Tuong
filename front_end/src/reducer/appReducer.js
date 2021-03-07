import { io } from "socket.io-client";

const gameReducer = (
  state = {
    lang: "English",
    socket: io("http://localhost:8080/play"),
    currentIntervalID: null,
  },
  action
) => {
  const newState = Object.assign({}, state);
  const { type, value } = action;
  switch (type) {
    case "setLang":
      newState.lang = value;
      return newState;
    case "setSocket":
      newState.socket = value;
      return newState;
    case "setCurrentIntervalID":
      newState.currentIntervalID = value;
      return newState;
    default:
      return state;
  }
};

export default gameReducer;
