const gameReducer = (
  state = { lang: "English", socket: null, currentTimerID: null },
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
    case "setCurrentTimerID":
      newState.currentTimerID = value;
      return newState;
    default:
      return state;
  }
};

export default gameReducer;
