import React, { useEffect, useState, useContext } from "react";
import EntryComponent from "./EntryComponent/EntryComponent.jsx";
import NavBar from "./NavBar/NavBar.jsx";
import { Container } from "react-bootstrap";
import "./Main.scss";
import { useSelector, useDispatch, useStore } from "react-redux";
import Game from "./Game/Game.jsx";
import { Spinner } from "react-bootstrap";
import callAPI from "../App/callAPI.js";
import { AuthenticateUserContext, SocketContext } from "../App/context";
import { Redirect } from "react-router-dom";
import Warning from "./Warning/Warning.jsx";
import VerifyEmailNote from "./VerifyEmailNote/VerifyEmailNote.jsx";
import Home from "../Home/Home.jsx";
import { useParams } from "react-router-dom";

const Main = (props) => {
  const dispatch = useDispatch();
  const [connectionError, setConnectionError] = useState(null);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const authenticateUser = useContext(AuthenticateUserContext);
  const socket = useContext(SocketContext);
  const store = useStore();
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const loginError = useSelector((state) => state.appState.loginError);
  const lang = useSelector((state) => state.appState.lang);
  const { username } = useParams();
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );

  useEffect(async () => {
    try {
      if (!isAuthenticated) {
        setWaitForResponse(true);
        const { user, message, opponentID } = await callAPI(
          "GET",
          "user",
          null
        );
        if (user) {
          authenticateUser(dispatch, user, opponentID);
        } else if (message) dispatch({ type: "setLoginError", value: message });
        setWaitForResponse(false);
      }
    } catch (err) {
      dispatch({ type: "setLoginError", value: err.message });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    document.querySelector("title").innerText =
      lang === "English" ? "Xiangqi" : "Cờ Tướng";
  }, [lang]);

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
  if (!isAuthenticated && props.home) return <Redirect to="/" />;

  return (
    <Container fluid className={waitForResponse ? "loading" : ""}>
      {waitForResponse ? (
        <Spinner
          animation="border"
          variant="secondary"
          style={{
            width: `${window.innerWidth / 5}px`,
            height: `${window.innerWidth / 5}px`,
            borderWidth: "9px",
          }}
        />
      ) : (
        <div>
          <NavBar setWaitForResponse={setWaitForResponse} />
          {props.home && isAuthenticated ? (
            <Home usename={username} />
          ) : isAuthenticated ? (
            <Game />
          ) : (
            <EntryComponent />
          )}
        </div>
      )}
      {playerInfo && !playerInfo.guest && !playerInfo.email.verified ? (
        <VerifyEmailNote />
      ) : null}
      {connectionError ? <Warning connectionError={connectionError} /> : null}
    </Container>
  );
};

export default Main;
