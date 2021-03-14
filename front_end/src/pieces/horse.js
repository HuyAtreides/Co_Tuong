import horseRules from "./move_rules/horseRules.js";
import Piece from "./piece.js";

class Horse extends Piece {
  constructor(width, row, col, name, choosenSide) {
    super(width, row, col, name, choosenSide);
    this.moves = horseRules;
  }

  canMoveToNewPosition(newRow, newCol, board) {
    const [curRow, curCol] = this.position;
    const [translateX, translateY] = [curCol * this.width, curRow * this.width];
    this.translate = `translate(${translateX}, ${translateY})`;
    if (this.side === this.choosenSide[1]) {
      const isValid = this.checkValidMove(newRow, newCol, board);
      if (isValid && !/translate/.test(isValid)) {
        if (!this.isBlocked(newRow, newCol, board)) {
          if (!board[newRow][newCol].side) {
            return true;
          } else if (board[newRow][newCol].side !== board[curRow][curCol].side)
            return "capture";
        }
      } else if (isValid) return isValid;
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

  canCaptureGeneral(tmpBoard) {
    const [curRow, curCol] = this.position;
    for (let move of this.moves) {
      const [newRow, newCol] = [curRow + move[0], curCol + move[1]];
      if (newCol >= 0 && newCol < 9 && newRow >= 0 && newRow < 10) {
        if (tmpBoard[newRow][newCol].side)
          if (tmpBoard[newRow][newCol].side !== tmpBoard[curRow][curCol].side)
            if (!this.isBlocked(newRow, newCol, tmpBoard))
              if (tmpBoard[newRow][newCol].name.split("-")[0] === "general") {
                return tmpBoard[newRow][newCol].translate;
              }
      }
    }
    return false;
  }
}

export default Horse;
