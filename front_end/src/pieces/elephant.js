import Piece from "./piece.js";
import elephantRules from "./move_rules/elephantRules.js";

class Elephant extends Piece {
  constructor(width, row, col, name, choosenSide) {
    super(width, row, col, name, choosenSide);
    this.moves = elephantRules;
    this.maxRow = this.side === this.choosenSide[0] ? 4 : 9;
    this.minRow = this.side === this.choosenSide[0] ? 0 : 5;
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
