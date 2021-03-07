import initializeBoard from "../Components/Main/Game/Board/initializeBoard.js";

const defaultState = {
  board: initializeBoard(520 / 9, ["red", "black"]),
  targetDisplay: "none",
  targetTranslate: "translate(0, 0)",
  boardSize: [520, 520 / (521 / 577)],
  currentPiece: null,
  getClicked: false,
  draggable: false,
  capturedPieces: [],
  turnToMove: false,
  side: ["red", "black"],
};

const boardReducer = (state = defaultState, action) => {
  const newState = Object.assign({}, state);
  const { type, value } = action;
  switch (type) {
    case "setBoard":
      newState.board = value;
      return newState;
    case "setTargetDisplay":
      newState.targetDisplay = value;
      return newState;
    case "setTargetTranslate":
      newState.targetTranslate = value;
      return newState;
    case "setBoardSize":
      newState.boardSize = value;
      return newState;
    case "setCurrentPiece":
      newState.currentPiece = value;
      return newState;
    case "setGetClicked":
      newState.getClicked = value;
      return newState;
    case "setDraggable":
      newState.draggable = value;
      return newState;
    case "setCapturedPieces":
      const newCapturedPieces = [...newState.capturedPieces];
      newCapturedPieces.push(value);
      newState.capturedPieces = newCapturedPieces;
      return newState;
    case "setTurnToMove":
      newState.turnToMove = value;
      return newState;
    case "switchSide":
      const width = +document.querySelector(".board-container").offsetWidth;
      newState.board = initializeBoard(width / 9, value);
      newState.side = value;
      return newState;
    case "resetBoardState":
      defaultState.board = initializeBoard(value / 9, ["red", "black"]);
      defaultState.boardSize = [value, value / (521 / 577)];
      return defaultState;
    default:
      return state;
  }
};

export default boardReducer;
