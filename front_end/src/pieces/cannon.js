import Piece from "./piece.js";
import cannonRules from "./move_rules/cannonRules.js";

class Cannon extends Piece {
  constructor(width, row, col, name, choosenSide) {
    super(width, row, col, name, choosenSide);
    this.moves = cannonRules;
  }

  setNewPosition(x, y, board, turnToMove) {
    const newCol = Math.floor(x / this.width);
    const newRow = Math.floor(y / this.width);
    const [curRow, curCol] = this.position;
    this.translate = `translate(${curCol * this.width}, ${
      curRow * this.width
    })`;
    if (turnToMove && this.side === this.choosenSide[1]) {
      if (this.checkValidMove(newRow, newCol, board)) {
        if (!board[newRow][newCol].side) {
          if (this.countPiecesBetween(newRow, newCol, board) === 0)
            return this.setPosition(false, newRow, newCol);
        } else if (board[newRow][newCol].side !== board[curRow][curCol].side)
          if (this.countPiecesBetween(newRow, newCol, board) === 2)
            return this.setPosition(true, newRow, newCol);
      }
    }
  }

  canSaveGeneral(piece, board) {
    const [curRow, curCol] = piece.position;
    for (let move of piece.moves) {
      const tmpBoard = board.reduce((acc, row) => {
        acc.push([...row]);
        return acc;
      }, []);
      const [newRow, newCol] = [curRow + move[0], curCol + move[1]];
      if (
        newCol >= piece.minCol &&
        newCol <= piece.maxCol &&
        newRow >= piece.minRow &&
        newRow <= piece.maxRow
      ) {
        if (!tmpBoard[newRow][newCol]) {
          if (piece.countPiecesBetween(newRow, newCol, tmpBoard) === 0) {
            this.updateTmpBoard(newRow, newCol, tmpBoard);
            if (!Piece.isGeneralInDanger(tmpBoard)) return true;
          }
        } else if (tmpBoard[newRow][newCol].side !== piece.side) {
          if (piece.countPiecesBetween(newRow, newCol, tmpBoard) === 2) {
            this.updateTmpBoard(newRow, newCol, tmpBoard);
            if (!Piece.isGeneralInDanger(tmpBoard)) return true;
          }
        }
      }
    }
    return false;
  }

  canCaptureGeneral(board) {
    const [curRow, curCol] = this.position;
    for (let move of this.moves) {
      const [newRow, newCol] = [curRow + move[0], curCol + move[1]];
      if (newCol >= 0 && newCol < 9 && newRow >= 0 && newRow < 10) {
        if (board[newRow][newCol].side)
          if (board[newRow][newCol].side !== board[curRow][curCol].side)
            if (this.countPiecesBetween(newRow, newCol, board) === 2)
              if (board[newRow][newCol].name.split("-")[0] === "general")
                return true;
      }
    }
  }
}

export default Cannon;
