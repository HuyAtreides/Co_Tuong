import Piece from "./piece.js";
import advisorRules from "./move_rules/advisorRules.js";

class Advisor extends Piece {
  constructor(width, row, col, name, choosenSide) {
    super(width, row, col, name, choosenSide);
    this.moves = advisorRules;
  }

  checkValidMove(newRow, newCol, board) {
    const [curRow, curCol] = this.position;
    const [moveRow, moveCol] = [newRow - curRow, newCol - curCol];
    const maxRow = this.side === this.choosenSide[0] ? 3 : 10;
    const minRow = this.side === this.choosenSide[0] ? 0 : 7;
    const valid =
      newCol >= 3 && newCol < 6 && newRow >= minRow && newRow < maxRow;
    const existMove = this.moves.some((move) => {
      return move[0] === moveRow && move[1] === moveCol;
    });
    return (
      valid && existMove && !this.putGeneralInDanger(newRow, newCol, board)
    );
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
