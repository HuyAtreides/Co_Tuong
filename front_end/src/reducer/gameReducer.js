const gameReducer = (
  state = {
    findingMatch: false,
    foundMatch: false,
    time: 10,
    opponentTimeLeftToMove: 10 * 60,
    playerTimeLeftToMove: 10 * 60,
    pause: false,
    offeredADraw: false,
    getADrawOffer: false,
    messages: [],
    messageToSend: null,
  },
  action
) => {
  const newState = Object.assign({}, state);
  const { type, value } = action;
  switch (type) {
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
    case "setOfferedDraw":
      newState.offeredADraw = value;
      return newState;
    case "setADrawOffer":
      newState.getADrawOffer = value;
      return newState;
    case "setMessageToSend":
      newState.messageToSend = value;
      return newState;
    case "setMessage":
      const newMessages = [...newState.messages];
      newMessages.push(value);
      newState.messages = newMessages;
      return newState;
    default:
      return state;
  }
};

export default gameReducer;
