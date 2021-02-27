import boardReducer from "./boardReducer.js";
import gameReducer from "./gameReducer.js";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  boardState: boardReducer,
  gameState: gameReducer,
});

export default rootReducer;
