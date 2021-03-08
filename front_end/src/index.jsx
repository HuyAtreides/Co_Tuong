import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { App } from "./Components/App/App.jsx";
import { createStore } from "redux";
import { Provider } from "react-redux";
import rootReducer from "./reducer/rootReducer.js";
import "bootstrap/dist/css/bootstrap.min.css";

const store = createStore(rootReducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
