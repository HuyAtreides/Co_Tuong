import React, { useEffect, useState, useContext } from "react";
import EntryComponent from "./EntryComponent/EntryComponent.jsx";
import NavBar from "./NavBar/NavBar.jsx";
import { Container } from "react-bootstrap";
import "./Main.scss";
import { useSelector, useDispatch } from "react-redux";
import Game from "./Game/Game.jsx";
import { Spinner } from "react-bootstrap";
import callAPI from "../App/callAPI.js";
import { SocketContext } from "../App/context";
import VerifyEmailNote from "./VerifyEmailNote/VerifyEmailNote.jsx";

const Main = () => {
  const dispatch = useDispatch();
  const [waitForResponse, setWaitForResponse] = useState(false);
  const socket = useContext(SocketContext);
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );

  useEffect(async () => {
    if (!isAuthenticated) {
      setWaitForResponse(true);
      const { user } = await callAPI("GET", "/", null);
      setWaitForResponse(false);
      if (user) {
        dispatch({ type: "setIsAuthenticated", value: true });
        dispatch({ type: "setPlayerInfo", value: user });
        socket.auth = {
          playername: user.username,
          photo: user.photo,
        };
        socket.connect();
      }
    }
  }, [isAuthenticated]);

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
      {playerInfo && !playerInfo.email.verify ? <VerifyEmailNote /> : null}
    </Container>
  );
};

export default Main;
