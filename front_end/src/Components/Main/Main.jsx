import React, { useEffect, useState, useContext } from "react";
import EntryComponent from "./EntryComponent/EntryComponent.jsx";
import NavBar from "./NavBar/NavBar.jsx";
import { Container } from "react-bootstrap";
import "./Main.scss";
import { useSelector, useDispatch } from "react-redux";
import Game from "./Game/Game.jsx";
import { Spinner } from "react-bootstrap";
import callAPI from "../App/callAPI.js";
import { AuthenticateUserContext, SocketContext } from "../App/context";
import { Redirect } from "react-router-dom";
import Warning from "./Warning/Warning.jsx";
import VerifyEmailNote from "./VerifyEmailNote/VerifyEmailNote.jsx";

const Main = () => {
  const dispatch = useDispatch();
  const [waitForResponse, setWaitForResponse] = useState(false);
  const authenticateUser = useContext(AuthenticateUserContext);
  const socket = useContext(SocketContext);
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const loginError = useSelector((state) => state.appState.loginError);
  const lang = useSelector((state) => state.appState.lang);
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );
  const [loginOnOtherPlace, setLoginOnOtherPlace] = useState(false);

  useEffect(async () => {
    if (!isAuthenticated) {
      setWaitForResponse(true);
      const { user, sessionID, message } = await callAPI("GET", "user", null);
      setWaitForResponse(false);
      if (user) {
        authenticateUser(dispatch, user, sessionID);
      } else if (message) dispatch({ type: "setLoginError", value: message });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    document.querySelector("title").innerText =
      lang === "English" ? "Xiangqi" : "Cờ Tướng";
  }, [lang]);

  useEffect(() => {
    socket.on("loginOnOtherPlace", () => {
      setLoginOnOtherPlace(true);
    });
  }, []);

  if (loginError) return <Redirect to="/signin" />;

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
          {isAuthenticated ? <Game /> : <EntryComponent />}
        </div>
      )}
      {playerInfo && !playerInfo.guest && !playerInfo.email.verified ? (
        <VerifyEmailNote />
      ) : null}
      {loginOnOtherPlace ? <Warning /> : null}
    </Container>
  );
};

export default Main;
