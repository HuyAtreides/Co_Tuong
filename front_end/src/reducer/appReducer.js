const gameReducer = (
  state = {
    lang: "English",
    isAuthenticated: false,
    playerInfo: null,
    loginError: null,
  },
  action
) => {
  const newState = Object.assign({}, state);
  const { type, value } = action;
  switch (type) {
    case "setLoginError":
      newState.loginError = value;
      return newState;
    case "setPlayerInfo":
      newState.playerInfo = value;
      return newState;
    case "setLang":
      newState.lang = value;
      return newState;
    case "setIsAuthenticated":
      newState.isAuthenticated = value;
      return newState;
    default:
      return state;
  }
};

export default gameReducer;
