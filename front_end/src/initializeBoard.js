import Piece from "./pieces/piece.js";
import instantiatePiece from "./pieces/instantiatePiece.js";

const getInitialPosition = (side) => {
  return {
    "0,0": `chariot-${side[0]}`,
    "0,1": `horse-${side[0]}`,
    "0,2": `elephant-${side[0]}`,
    "0,3": `advisor-${side[0]}`,
    "0,4": `general-${side[0]}`,
    "0,5": `advisor-${side[0]}`,
    "0,6": `elephant-${side[0]}`,
    "0,7": `horse-${side[0]}`,
    "0,8": `chariot-${side[0]}`,
    "2,1": `cannon-${side[0]}`,
    "2,7": `cannon-${side[0]}`,
    "3,0": `soldier-${side[0]}`,
    "3,2": `soldier-${side[0]}`,
    "3,4": `soldier-${side[0]}`,
    "3,6": `soldier-${side[0]}`,
    "3,8": `soldier-${side[0]}`,
    "6,0": `soldier-${side[1]}`,
    "6,2": `soldier-${side[1]}`,
    "6,4": `soldier-${side[1]}`,
    "6,6": `soldier-${side[1]}`,
    "6,8": `soldier-${side[1]}`,
    "7,1": `cannon-${side[1]}`,
    "7,7": `cannon-${side[1]}`,
    "9,0": `chariot-${side[1]}`,
    "9,1": `horse-${side[1]}`,
    "9,2": `elephant-${side[1]}`,
    "9,3": `advisor-${side[1]}`,
    "9,4": `general-${side[1]}`,
    "9,5": `advisor-${side[1]}`,
    "9,6": `elephant-${side[1]}`,
    "9,7": `horse-${side[1]}`,
    "9,8": `chariot-${side[1]}`,
  };
};

const initializeBoard = (width, side) => {
  const initialBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const initialPosition = getInitialPosition(side);
  for (let i = 0; i < 10; i++)
    for (let j = 0; j < 9; j++) {
      const pieceName = initialPosition[[i, j].toString()];
      if (pieceName) {
        initialBoard[i][j] = instantiatePiece(width, i, j, pieceName, side);
      }
    }
  return initialBoard;
};

export default initializeBoard;
