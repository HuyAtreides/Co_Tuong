import React, { useEffect, useState, useContext } from "react";
import EntryComponent from "./EntryComponent/EntryComponent.jsx";
import NavBar from "./NavBar/NavBar.jsx";
import { Container, Spinner } from "react-bootstrap";
import useFetchData from "../App/useFetchData.js";
import "./Main.scss";
import { useSelector, useDispatch, useStore } from "react-redux";
import Game from "./Game/Game.jsx";
import { SocketContext } from "../App/context";
import { Redirect } from "react-router-dom";
import Warning from "./Warning/Warning.jsx";
import VerifyEmailNote from "./VerifyEmailNote/VerifyEmailNote.jsx";

const Main = (props) => {
  const dispatch = useDispatch();
  const [connectionError, setConnectionError] = useState(null);
  const socket = useContext(SocketContext);
  const store = useStore();
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const loginError = useSelector((state) => state.appState.loginError);
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );
  const [waitForResponse, setWaitForResponse] = useFetchData();

  useEffect(() => {
    socket.on("connect_error", (err) => {
      setConnectionError(err.message);
      socket.close();
    });

    socket.on("connect", () => {
      if (connectionError === "The connection was closed") {
        setConnectionError("Successfully reconnect");
        setTimeout(() => {
          setConnectionError(null);
        }, 1000);
      }
    });

    return () => {
      socket.removeAllListeners("connect_error");
      socket.removeAllListeners("connect");
    };
  }, [connectionError]);

  useEffect(() => {
    socket.on("disconnect", (reason) => {
      const foundMatch = store.getState().gameState.foundMatch;
      if (!foundMatch) {
        dispatch({ type: "setFindingMatch", value: "Connection Was Closed" });
        setTimeout(() => {
          dispatch({ type: "setFindingMatch", value: "Play" });
        }, 700);
      }
      if (reason !== "io client disconnect") {
        setConnectionError("The connection was closed");
        socket.open();
        if (foundMatch) {
          dispatch({ type: "setGameResult", value: undefined });
          dispatch({
            type: "setMessage",
            value: {
              from: "",
              className: "game-message",
              message: "The connection was closed",
            },
          });
        }
      }
    });

    return () => {
      socket.removeAllListeners("disconnect");
    };
  }, []);

  if (loginError) return <Redirect to="/signin" />;
  if (waitForResponse)
    return (
      <Spinner animation="border" variant="secondary" className="spinner" />
    );

  return (
    <Container fluid>
      <div>
        <NavBar setWaitForResponse={setWaitForResponse} />
        {isAuthenticated ? <Game /> : <EntryComponent />}
      </div>

      {playerInfo && !playerInfo.guest && !playerInfo.email.verified ? (
        <VerifyEmailNote />
      ) : null}
      {connectionError ? <Warning connectionError={connectionError} /> : null}
    </Container>
  );
};

export default Main;
