import Piece from "./piece.js";
import elephantRules from "./move_rules/elephantRules.js";

class Elephant extends Piece {
  constructor(width, row, col, name, choosenSide) {
    super(width, row, col, name, choosenSide);
    this.moves = elephantRules;
  }

  checkValidMove(newRow, newCol, board) {
    const [curRow, curCol] = this.position;
    const [moveRow, moveCol] = [newRow - curRow, newCol - curCol];
    const maxRow = this.side === this.choosenSide[0] ? 5 : 10;
    const minRow = this.side === this.choosenSide[0] ? 0 : 5;
    const valid =
      newCol >= 0 && newCol < 9 && newRow >= minRow && newRow < maxRow;
    const existMove = this.moves.some((move) => {
      return move[0] === moveRow && move[1] === moveCol;
    });
    const generalInDanger = this.putGeneralInDanger(newRow, newCol, board);
    return valid && existMove && !generalInDanger;
  }

  countPiecesBetween(newRow, newCol, board) {
    let [curRow, curCol] = this.position;
    let count = 0;
    do {
      curCol += curCol > newCol ? -1 : 1;
      curRow += curRow > newRow ? -1 : 1;
      if (board[curRow][curCol]) count++;
    } while (curCol !== newCol || curRow !== newRow);

    return count;
  }

  canCaptureGeneral() {
    return false;
  }
}

export default Elephant;
