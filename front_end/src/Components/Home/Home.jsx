import React, { useEffect, useState } from "react";
import "./Home.scss";
import { Table, Row, Col, Spinner, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect, useParams } from "react-router-dom";
import ProfileHeader from "./ProfileHeader/ProfileHeader.jsx";
import ProfileInfo from "./ProfileInfo/ProfileInfo.jsx";
import MatchHistory from "./MatchHistory/MatchHistory.jsx";
import NavBar from "../Main/NavBar/NavBar.jsx";
import callAPI from "../App/callAPI.js";

const Home = () => {
  const dispatch = useDispatch();
  const { name } = useParams();
  const [error, setError] = useState(null);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );

  useEffect(async () => {
    if (!isAuthenticated) {
      setWaitForResponse(true);
      const { user } = await callAPI("GET", "api/user");
      setWaitForResponse(false);
      if (user) {
        dispatch({ type: "setPlayerInfo", value: user });
        dispatch({ type: "setIsAuthenticated", value: true });
      } else setRedirect(true);
    }
  }, []);

  if (!isAuthenticated && redirect) return <Redirect to="/" />;

  return (
    <Container fluid className={waitForResponse ? "loading" : ""}>
      {waitForResponse || !isAuthenticated ? (
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
        <>
          <NavBar setWaitForResponse={setWaitForResponse} home={true} />
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
              md={{ span: 8 }}
              sm={{ span: 11 }}
              className="profile-info-container"
            >
              <ProfileHeader setError={setError} />
              <ProfileInfo />
              <MatchHistory />
            </Col>
            <Col
              md={{ span: 3 }}
              sm={{ span: 11 }}
              className="find-players-container"
            >
              <div className="find-players">Col-2</div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Home;
