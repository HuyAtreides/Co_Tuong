const gameReducer = (state = { findingMatch: false }, action) => {
  const newState = Object.assign({}, state);
  const { type, value } = action;
  switch (type) {
    case "setFindingMatch":
      newState.findingMatch = value;
      return newState;
    default:
      return state;
  }
};

export default gameReducer;
