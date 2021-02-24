import Advisor from "./advisor.js";
import generalRules from "./move_rules/generalRules.js";

class General extends Advisor {
  constructor(width, row, col, name, choosenSide) {
    super(width, row, col, name, choosenSide);
    this.moves = generalRules;
  }

  canCaptureGeneral(tmpBoard) {
    let [curRow, curCol] = this.position;
    const tmp = curRow < 3 ? 1 : -1;
    do {
      curRow += tmp;
      if (tmpBoard[curRow][curCol]) {
        if (tmpBoard[curRow][curCol].name.split("-")[0] === "general")
          return true;
        return false;
      }
    } while (curRow !== 0 || curRow !== 9);
    return false;
  }

  countPiecesBetween(newRow, newCol, board) {
    let [curRow, curCol] = this.position;
    let count = 0;
    if (newRow === curRow) {
      do {
        curCol += curCol > newCol ? -1 : 1;
        if (board[curRow][curCol]) count++;
      } while (curCol !== newCol);
    } else {
      do {
        curRow += curRow > newRow ? -1 : 1;
        if (board[curRow][curCol]) count++;
      } while (curRow !== newRow);
    }
    return count;
  }
}

export default General;
