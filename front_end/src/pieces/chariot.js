import Piece from "./piece.js";
import chariotRules from "./move_rules/chariotRules.js";

class Chariot extends Piece {
  constructor(width, row, col, name, choosenSide) {
    super(width, row, col, name, choosenSide);
    this.moves = chariotRules;
  }
}

export default Chariot;
