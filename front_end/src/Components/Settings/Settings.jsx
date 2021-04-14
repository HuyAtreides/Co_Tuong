import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import useFetchData from "../App/useFetchData.js";
import {
  Form,
  Container,
  Row,
  Col,
  InputGroup,
  Spinner,
  Button,
} from "react-bootstrap";
import NavBar from "../Main/NavBar/NavBar.jsx";
import "./Settings.scss";
import callAPI from "../App/callAPI.js";
import useValidateInput from "../Signup/useValidateInput.js";
import ProfileHeader from "../Home/ProfileHeader/ProfileHeader.jsx";

const Settings = () => {
  const dispatch = useDispatch();
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const [buttonText, setButtonText] = useState("Save");
  const [uploadErr, setUploadErr] = useState(null);
  const [waitForServer, setWaitForServer] = useState(false);
  const validateInput = useValidateInput(false, true);
  const [waitForResponse, setWaitForResponse] = useFetchData();

  const getChanges = () => {
    const changes = {};
    const { username, email, lastname, firstname } = validateInput;
    if (playerInfo.username !== username) changes["username"] = username;
    if (playerInfo.email.value !== email) {
      changes["email"] = { value: email, verified: false };
    }
    changes["name.lastname"] = lastname;
    changes["name.firstname"] = firstname;
    if (validateInput.password) changes["password"] = validateInput.password;
    return changes;
  };

  const handleSaveChange = async (event) => {
    try {
      event.preventDefault();
      if (waitForServer) return;
      setUploadErr("");
      validateInput.setError(null);
      const { password, confirmPassword } = validateInput;
      const missingField = validateInput.handleMissingField(
        !playerInfo.email.value
      );
      if (password !== confirmPassword) {
        validateInput.setConfirmPasswordMess("Password doesn't match");
        return;
      }
      if (
        !missingField &&
        !validateInput.invalidEmailMess &&
        !validateInput.invalidPasswordMess &&
        !validateInput.invalidUsernameMess &&
        !validateInput.confirmPasswordMess
      ) {
        const changes = getChanges();
        setWaitForServer(true);
        const { user, message, ok } = await callAPI(
          "POST",
          "api/signup/settings",
          {
            changes: changes,
            currentPassword: validateInput.currentPassword,
            user: playerInfo.username,
          }
        );
        setWaitForServer(false);
        if (user) {
          dispatch({ type: "setPlayerInfo", value: user });
          setButtonText("Your settings have been saved.");
          setTimeout(() => {
            setButtonText("Save");
          }, 1000);
        } else if (message) validateInput.handleError(ok, message);
      }
    } catch (err) {
      setWaitForServer(false);
      setUploadErr(err.message);
    }
  };

  useEffect(() => {
    if (playerInfo) {
      validateInput.setUsername(playerInfo.username);
      validateInput.setEmail(playerInfo.email.value);
      validateInput.setLastname(playerInfo.name.lastname);
      validateInput.setFirstname(playerInfo.name.firstname);
    }
  }, []);

  if (!playerInfo) return <Redirect to="/" />;

  if (waitForResponse)
    return (
      <Spinner animation="border" variant="secondary" className="spinner" />
    );

  return (
    <Container fluid className="settings-container">
      <NavBar setWaitForResponse={setWaitForResponse} />
      <Row className="home-row mt-3">
        <p
          className="upload-pic-err"
          style={{
            display: uploadErr || validateInput.error ? "block" : " none",
          }}
        >
          <i
            className="fas fa-times"
            onClick={() => {
              validateInput.setError(null);
              setUploadErr(null);
            }}
          ></i>
          {uploadErr ? uploadErr : validateInput.error}
        </p>
        <Col xs={{ span: 11 }} md={{ span: 7 }}>
          <ProfileHeader
            setError={setUploadErr}
            setting={true}
            playerInfo={playerInfo}
          />
          <Form
            className="mt-3 mb-3 settings-form"
            method="POST"
            onSubmit={handleSaveChange}
          >
            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Username
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    value={validateInput.username}
                    onChange={validateInput.handleUsernameChange}
                    isInvalid={validateInput.invalidUsernameMess !== ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validateInput.invalidUsernameMess}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Email
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation>
                  <Form.Control
                    type="email"
                    value={validateInput.email}
                    onChange={validateInput.handleEmailChange}
                    isInvalid={validateInput.invalidEmailMess !== ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validateInput.invalidEmailMess}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Firstname
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={validateInput.firstname}
                  onChange={validateInput.handleFirstnameChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Lastname
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  value={validateInput.lastname}
                  onChange={validateInput.handleLastnameChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Current Password
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    value={validateInput.currentPassword}
                    onChange={validateInput.handleCurrentPasswordChange}
                    isInvalid={validateInput.invalidCurrentPassword !== ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validateInput.invalidCurrentPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                New Password
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation className="password-group">
                  <Form.Control
                    type={validateInput.showPassword ? "text" : "password"}
                    value={validateInput.password}
                    isInvalid={validateInput.invalidPasswordMess !== ""}
                    onChange={validateInput.handlePasswordChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validateInput.invalidPasswordMess}
                  </Form.Control.Feedback>
                  <button
                    className="toggle-password"
                    type="button"
                    style={{
                      display: validateInput.invalidPasswordMess
                        ? "none"
                        : "inline",
                    }}
                    onClick={() => {
                      validateInput.setShowPassword(
                        !validateInput.showPassword
                      );
                    }}
                  >
                    {validateInput.showPassword ? "Hide" : "Show"}
                  </button>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mt-4">
              <Form.Label column sm={2}>
                Confirm New Password
              </Form.Label>
              <Col sm={10}>
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    value={validateInput.confirmPassword}
                    onChange={validateInput.handleConfirmPasswordChange}
                    isInvalid={validateInput.confirmPasswordMess !== ""}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validateInput.confirmPasswordMess}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Col className="mt-4">
              <Button type="submit" className="submit-form-button">
                {waitForServer ? (
                  <Spinner animation="border" variant="dark" />
                ) : (
                  buttonText
                )}
              </Button>
            </Col>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
