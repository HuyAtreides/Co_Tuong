import horseRules from "./move_rules/horseRules.js";
import Piece from "./piece.js";

class Horse extends Piece {
  constructor(width, row, col, name, choosenSide) {
    super(width, row, col, name, choosenSide);
    this.moves = horseRules;
  }

  setNewPosition(x, y, board, turnToMove) {
    const newCol = Math.floor(x / this.width);
    const newRow = Math.floor(y / this.width);
    const [curRow, curCol] = this.position;
    const [translateX, translateY] = [curCol * this.width, curRow * this.width];
    this.translate = `translate(${translateX}, ${translateY})`;
    if (turnToMove && this.side === this.choosenSide[1]) {
      const isValid = this.checkValidMove(newRow, newCol, board);
      if (isValid && !/translate/.test(isValid)) {
        if (!this.isBlocked(newRow, newCol, board)) {
          if (!board[newRow][newCol].side)
            return this.setPosition(false, newRow, newCol);
          else if (board[newRow][newCol].side !== board[curRow][curCol].side)
            return this.setPosition(true, newRow, newCol);
        }
      } else if (isValid) return isValid;
    }
    return null;
  }

  canSaveGeneral(board) {
    const [curRow, curCol] = this.position;
    for (let move of this.moves) {
      const tmpBoard = board.reduce((acc, row) => {
        acc.push([...row]);
        return acc;
      }, []);
      const [newRow, newCol] = [curRow + move[0], curCol + move[1]];
      if (
        newCol >= this.minCol &&
        newCol <= this.maxCol &&
        newRow >= this.minRow &&
        newRow <= this.maxRow &&
        !this.isBlocked(newRow, newCol, tmpBoard)
      ) {
        if (!tmpBoard[newRow][newCol].side) {
          if (this.countPiecesBetween(newRow, newCol, tmpBoard) === 0) {
            this.updateTmpBoard(newRow, newCol, tmpBoard);
            if (!Piece.isGeneralInDanger(tmpBoard, this.side)) return true;
          }
        } else if (tmpBoard[newRow][newCol].side !== this.side) {
          if (this.countPiecesBetween(newRow, newCol, tmpBoard) == 1) {
            this.updateTmpBoard(newRow, newCol, tmpBoard);
            if (!Piece.isGeneralInDanger(tmpBoard, this.side)) return true;
          }
        }
      }
    }
    return false;
  }

  isBlocked(newRow, newCol, board) {
    const [curRow, curCol] = this.position;
    const [moveRow, moveCol] = [newRow - curRow, newCol - curCol];
    if (Math.abs(moveRow) === 2) {
      return board[curRow + moveRow / 2][curCol] !== 0;
    } else {
      return board[curRow][curCol + moveCol / 2] !== 0;
    }
  }

  canCaptureGeneral(board) {
    const [curRow, curCol] = this.position;
    for (let move of this.moves) {
      const [newRow, newCol] = [curRow + move[0], curCol + move[1]];
      if (newCol >= 0 && newCol < 9 && newRow >= 0 && newRow < 10) {
        if (board[newRow][newCol].side)
          if (board[newRow][newCol].side !== board[curRow][curCol].side)
            if (!this.isBlocked(newRow, newCol, board))
              if (board[newRow][newCol].name.split("-")[0] === "general")
                return board[newRow][newCol].translate;
      }
    }
    return false;
  }
}

export default Horse;
