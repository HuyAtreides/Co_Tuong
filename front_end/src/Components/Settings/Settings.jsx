import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Form,
  Container,
  Row,
  Col,
  InputGroup,
  hasValidation,
} from "react-bootstrap";
import NavBar from "../Main/NavBar/NavBar.jsx";
import "./Settings.scss";
import ProfileHeader from "../Home/ProfileHeader/ProfileHeader.jsx";

const Settings = ({ setWaitForResponse }) => {
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const [error, setError] = useState(null);

  if (!playerInfo) return <Redirect to="/" />;

  return (
    <Container fluid className="settings-container">
      <NavBar setWaitForResponse={setWaitForResponse} />
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
        <Col xs={{ span: 11 }} md={{ span: 9 }}>
          <ProfileHeader
            setError={setError}
            setting={true}
            playerInfo={playerInfo}
          />
          <Form className="mt-3 settings-form">
            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                Email
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation>
                  <Form.Control type="email" />
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
