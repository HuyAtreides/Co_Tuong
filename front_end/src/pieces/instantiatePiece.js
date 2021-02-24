import Advisor from "./advisor.js";
import General from "./general.js";
import Cannon from "./cannon.js";
import Elephant from "./elephant.js";
import Chariot from "./chariot.js";
import Horse from "./horse.js";
import Solider from "./soldier.js";

const instantiatePiece = (width, row, col, name, choosenSide) => {
  const pieceName = name.split("-")[0];
  switch (pieceName) {
    case "advisor":
      return new Advisor(width, row, col, name, choosenSide);
    case "general":
      return new General(width, row, col, name, choosenSide);
    case "cannon":
      return new Cannon(width, row, col, name, choosenSide);
    case "soldier":
      return new Solider(width, row, col, name, choosenSide);
    case "chariot":
      return new Chariot(width, row, col, name, choosenSide);
    case "horse":
      return new Horse(width, row, col, name, choosenSide);
    default:
      return new Elephant(width, row, col, name, choosenSide);
  }
};

export default instantiatePiece;
