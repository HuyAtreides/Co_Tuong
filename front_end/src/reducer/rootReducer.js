import boardReducer from "./boardReducer.js";
import appReducer from "./appReducer.js";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  boardState: boardReducer,
  appState: appReducer,
});

export default rootReducer;
