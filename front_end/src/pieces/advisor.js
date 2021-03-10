import Piece from "./piece.js";
import advisorRules from "./move_rules/advisorRules.js";

class Advisor extends Piece {
  constructor(width, row, col, name, choosenSide) {
    super(width, row, col, name, choosenSide);
    this.moves = advisorRules;
    this.minCol = 3;
    this.maxCol = 5;
    this.minRow = this.side === this.choosenSide[0] ? 0 : 7;
    this.maxRow = this.side === this.choosenSide[0] ? 2 : 9;
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

export default Advisor;
