const defaultState = {
  findingMatch: "Play",
  foundMatch: false,
  time: 10,
  opponentTimeLeftToMove: 10 * 60,
  playerTimeLeftToMove: 10 * 60,
  pause: false,
  pauseTime: 25 * 60,
  receiveDrawOffer: false,
  messages: [],
  opponentInfo: {
    playername: "Opponent",
    photo:
      "https://betacssjs.chesscomfiles.com/bundles/web/images/black_400.918cdaa6.png",
  },
  gameResult: null,
  gameResultDisplay: "flex",
};

const gameReducer = (state = defaultState, action) => {
  const newState = Object.assign({}, state);
  const { type, value } = action;
  switch (type) {
    case "setOpponentInfo":
      newState.opponentInfo = value;
      return newState;
    case "setPauseTime":
      if (value === "restart") newState.pauseTime = 25 * 60;
      else if (value === "timeout") newState.pauseTime = 5;
      else newState.pauseTime -= 1;
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
      if (value === "restart")
        newState.playerTimeLeftToMove = newState.time * 60;
      else newState.playerTimeLeftToMove -= 1;
      return newState;
    case "setOpponentTimeLeftToMove":
      if (value === "restart")
        newState.opponentTimeLeftToMove = newState.time * 60;
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
