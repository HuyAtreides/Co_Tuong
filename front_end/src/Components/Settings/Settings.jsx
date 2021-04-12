import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { Form, Container, Row, Col, InputGroup } from "react-bootstrap";
import NavBar from "../Main/NavBar/NavBar.jsx";
import "./Settings.scss";
import ProfileHeader from "../Home/ProfileHeader/ProfileHeader.jsx";

const Settings = ({ setWaitForResponse }) => {
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [lastname, setLastname] = useState();
  const [firstname, setFirstname] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    if (playerInfo) {
      setUsername(playerInfo.username);
      setEmail(playerInfo.email.value);
      setLastname(playerInfo.name.lastname);
      setFirstname(playerInfo.name.firstname);
    }
  }, []);

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
        <Col xs={{ span: 10 }} md={{ span: 7 }}>
          <ProfileHeader
            setError={setError}
            setting={true}
            playerInfo={playerInfo}
          />
          <Form className="mt-3 mb-3 settings-form" method="POST">
            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Username
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation>
                  <Form.Control type="text" value={username} />
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Email
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation>
                  <Form.Control type="email" value={email} />
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Firstname
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation>
                  <Form.Control type="text" value={firstname} />
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Lastname
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation>
                  <Form.Control type="text" value={lastname} />
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Password
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation className="password-group">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <Form.Control.Feedback type="invalid"></Form.Control.Feedback>
                  <button
                    className="toggle-password"
                    type="button"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Confirm Password
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation>
                  <Form.Control type="password" value={confirmPassword} />
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
