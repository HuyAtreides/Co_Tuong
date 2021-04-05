import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { App } from "./Components/App/App.jsx";
import { BrowserRouter as Router } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { batchedSubscribe } from "redux-batched-subscribe";
import { debounce } from "lodash";
import rootReducer from "./reducer/rootReducer.js";
import "bootstrap/dist/css/bootstrap.min.css";

const debounceNotify = debounce((notify) => notify());
const store = createStore(rootReducer, batchedSubscribe(debounceNotify));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
