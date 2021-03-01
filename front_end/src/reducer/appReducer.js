const gameReducer = (state = { lang: "English" }, action) => {
  const newState = Object.assign({}, state);
  const { type, value } = action;
  switch (type) {
    case "setLang":
      newState.lang = value;
      return newState;
    default:
      return state;
  }
};

export default gameReducer;
