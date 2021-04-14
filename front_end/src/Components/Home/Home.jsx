import React, { useEffect, useState } from "react";
import "./Home.scss";
import { Table, Row, Col, Spinner, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect, useParams } from "react-router-dom";
import FindMembers from "./FindMembers/FindMembers.jsx";
import ProfileHeader from "./ProfileHeader/ProfileHeader.jsx";
import ProfileInfo from "./ProfileInfo/ProfileInfo.jsx";
import MatchHistory from "./MatchHistory/MatchHistory.jsx";
import NavBar from "../Main/NavBar/NavBar.jsx";
import callAPI from "../App/callAPI.js";

const Home = (props) => {
  const dispatch = useDispatch();
  const { name } = useParams();
  const [error, setError] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const loginError = useSelector((state) => state.appState.loginError);
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(async () => {
    try {
      if (loginError) return;
      let response;
      if (!name) response = await callAPI("GET", "api/user");
      else
        response = await callAPI("POST", "api/user", {
          username: name,
        });
      const { user, message } = response;
      if (user) setUser(user);
      else if (message) dispatch({ type: "setLoginError", value: message });
      else if (!user) {
        if (playerInfo) setUser(playerInfo);
        else setRedirect(true);
      }
    } catch (err) {
      dispatch({ type: "setLoginError", value: err.message });
    }
  }, []);

  if (redirect) return <Redirect to="/" />;
  if (loginError) return <Redirect to="/signin" />;
  if (!user || waitForResponse)
    return (
      <Spinner animation="border" variant="secondary" className="spinner" />
    );

  return (
    <Container fluid>
      <NavBar
        setWaitForResponse={setWaitForResponse}
        setRedirect={setRedirect}
      />
      <Row className="home-row mt-3">
        <p
          className="upload-pic-err"
          style={{ display: error ? "block" : " none" }}
        >
          <i
            className="fas fa-times"
            onClick={() => {
              setError(null);
            }}
          ></i>
          {error}
        </p>
        <Col
          lg={{ span: 8 }}
          md={{ span: 9 }}
          sm={{ span: 11 }}
          className="profile-info-container"
        >
          <ProfileHeader
            setError={setError}
            playerInfo={user}
            viewOthersProfile={Boolean(name)}
          />
          <ProfileInfo playerInfo={user} />
          <MatchHistory playerInfo={user} viewOthersProfile={Boolean(name)} />
        </Col>
        <Col
          lg={{ span: 4 }}
          md={{ span: 9 }}
          sm={{ span: 11 }}
          className="find-players-container"
        >
          <FindMembers playerInfo={user} />
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
