import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import Chess from "./Components/chess.jsx";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducer/rootReducer.js";

const store = createStore(rootReducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Chess />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
