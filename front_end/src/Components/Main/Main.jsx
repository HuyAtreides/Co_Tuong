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
  const lang = useSelector((state) => state.appState.lang);
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const loginError = useSelector((state) => state.appState.loginError);
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );
  const [waitForResponse, setWaitForResponse] = useFetchData();

  useEffect(() => {
    if (connectionError) {
      if (connectionError === "The connection was closed")
        setConnectionError("Kết nối đã đóng");
      else if (connectionError === "Successfully reconnect")
        setConnectionError("Kết nối lại thành công");
      else if (/logged in/.test(connectionError))
        setConnectionError(
          "Kết nối đã đóng vì tài khoản của bạn được đăng nhập từ nơi khác"
        );
    }
  }, [lang]);

  useEffect(() => {
    socket.on("connect_error", (err) => {
      let errMess = err.message;
      if (/your account/.test(err) && lang !== "English")
        errMess =
          "Kết nối đã đóng vì tài khoản của bạn được đăng nhập từ nơi khác";
      setConnectionError(errMess);
      socket.close();
    });

    socket.on("connect", () => {
      if (
        connectionError === "The connection was closed" ||
        connectionError === "Kết nối đã đóng"
      ) {
        setConnectionError(
          lang === "English"
            ? "Successfully reconnect"
            : "Kết nối lại thành công"
        );
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
        dispatch({
          type: "setFindingMatch",
          value:
            lang === "English" ? "Connection Was Closed" : "Kết nối đã đóng",
        });
        setTimeout(() => {
          dispatch({
            type: "setFindingMatch",
            value: lang === "English" ? "Play" : "Chơi",
          });
        }, 700);
      }
      if (reason !== "io client disconnect") {
        socket.removeAllListeners("oneSecondPass");
        setConnectionError(
          lang === "English" ? "Connection Was Closed" : "Kết nối đã đóng"
        );
        socket.open();
        if (foundMatch) {
          dispatch({ type: "setGameResult", value: undefined });
          dispatch({
            type: "setMessage",
            value: {
              from: "",
              className: "game-message",
              message:
                lang === "English"
                  ? "Connection Was Closed"
                  : "Kết nối đã đóng",
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
        <VerifyEmailNote lang={lang} />
      ) : null}
      {connectionError ? <Warning connectionError={connectionError} /> : null}
    </Container>
  );
};

export default Main;
