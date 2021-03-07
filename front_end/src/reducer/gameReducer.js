const defaultState = {
  findingMatch: false,
  foundMatch: false,
  time: 10,
  opponentTimeLeftToMove: 10 * 60,
  playerTimeLeftToMove: 10 * 60,
  pause: false,
  receiveDrawOffer: false,
  messages: [],
  gameResult: null,
  sendGameResult: false,
  gameResultDisplay: "flex",
};

const gameReducer = (state = defaultState, action) => {
  const newState = Object.assign({}, state);
  const { type, value } = action;
  switch (type) {
    case "setSendGameResult":
      newState.sendGameResult = value;
      return newState;
    case "setGameResult":
      newState.gameResult = value;
      return newState;
    case "setFindingMatch":
      newState.findingMatch = value;
      return newState;
    case "setFoundMatch":
      newState.foundMatch = value;
      return newState;
    case "setTime":
      newState.time = value;
      newState.playerTimeLeftToMove = value * 60;
      newState.opponentTimeLeftToMove = value * 60;
      return newState;
    case "setPlayerTimeLeftToMove":
      if (value !== null) newState.playerTimeLeftToMove = newState.time * 60;
      else newState.playerTimeLeftToMove -= 1;
      return newState;
    case "setOpponentTimeLeftToMove":
      if (value !== null) newState.opponentTimeLeftToMove = newState.time * 60;
      else newState.opponentTimeLeftToMove -= 1;
      return newState;
    case "setPause":
      newState.pause = value;
      return newState;
    case "setReceiveDrawOffer":
      newState.receiveDrawOffer = value;
      return newState;
    case "setMessage":
      const newMessages = [...newState.messages];
      newMessages.push(value);
      newState.messages = newMessages;
      return newState;
    case "setGameResultDisplay":
      newState.gameResultDisplay = value;
      return newState;
    case "resetGameState":
      return defaultState;
    default:
      return state;
  }
};

export default gameReducer;
