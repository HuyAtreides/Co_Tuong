import Piece from "./piece.js";
import cannonRules from "./move_rules/cannonRules.js";

class Cannon extends Piece {
  constructor(width, row, col, name, choosenSide) {
    super(width, row, col, name, choosenSide);
    this.moves = cannonRules;
  }

  canMoveToNewPosition(newRow, newCol, board) {
    const [curRow, curCol] = this.position;
    const [translateX, translateY] = [curCol * this.width, curRow * this.width];
    this.translate = `translate(${translateX}, ${translateY})`;
    if (this.side === this.choosenSide[1]) {
      const isValid = this.checkValidMove(newRow, newCol, board);
      if (isValid && !/translate/.test(isValid)) {
        if (!board[newRow][newCol].side) {
          if (this.countPiecesBetween(newRow, newCol, board) === 0) return true;
        } else if (board[newRow][newCol].side !== board[curRow][curCol].side)
          if (this.countPiecesBetween(newRow, newCol, board) === 2) {
            return "capture";
          }
      } else if (isValid) return isValid;
    }
    return false;
  }

  canCaptureGeneral(tmpBoard) {
    const [curRow, curCol] = this.position;
    for (let move of this.moves) {
      const [newRow, newCol] = [curRow + move[0], curCol + move[1]];
      if (newCol >= 0 && newCol < 9 && newRow >= 0 && newRow < 10) {
        if (tmpBoard[newRow][newCol].side)
          if (tmpBoard[newRow][newCol].side !== tmpBoard[curRow][curCol].side)
            if (this.countPiecesBetween(newRow, newCol, tmpBoard) === 2)
              if (tmpBoard[newRow][newCol].name.split("-")[0] === "general") {
                return tmpBoard[newRow][newCol].translate;
              }
      }
    }
    return false;
  }
}

export default Cannon;
