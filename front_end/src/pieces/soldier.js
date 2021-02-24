import Piece from "./piece.js";
import soliderRules from "./move_rules/soldierRules.js";

class Soldier extends Piece {
  constructor(width, row, col, name, choosenSide) {
    super(width, row, col, name, choosenSide);
    this.moves =
      choosenSide[0] === this.side
        ? [...soliderRules[0]]
        : [...soliderRules[1]];
  }

  setPosition(capture, newRow, newCol) {
    const [translateX, translateY] = [newCol * this.width, newRow * this.width];
    const translate = `translate(${translateX}, ${translateY})`;
    this.position = [newRow, newCol];
    this.translate = translate;
    if (this.side === this.choosenSide[0]) {
      if (this.position[0] > 4) this.crossRiver();
    } else if (this.position[0] < 5) this.crossRiver();
    return [capture, newRow, newCol];
  }

  crossRiver() {
    this.moves.push([0, 1]);
    this.moves.push([0, -1]);
  }
}

export default Soldier;
