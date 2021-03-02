import boardReducer from "./boardReducer.js";
import appReducer from "./appReducer.js";
import { combineReducers } from "redux";
import gameReducer from "./gameReducer.js";

const rootReducer = combineReducers({
  boardState: boardReducer,
  appState: appReducer,
  gameState: gameReducer,
});

export default rootReducer;
