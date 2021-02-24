import boardReducer from "./boardReducer.js";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  boardState: boardReducer,
});

export default rootReducer;
