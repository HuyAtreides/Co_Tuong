import React, { useState, useContext } from "react";
import { AuthenticateUserContext } from "../App/context.js";
import callAPI from "../App/callAPI.js";
import useValidateInput from "../Signup/useValidateInput.js";
import {
  Container,
  Form,
  InputGroup,
  Button,
  Spinner,
  Row,
  Col,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import "./SignIn.scss";

const Login = () => {
  const dispatch = useDispatch();
  const authenticateUser = useContext(AuthenticateUserContext);
  const [successfullyLogin, setSuccessfullyLogin] = useState(false);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [waitForServer, setWaitForServer] = useState(false);
  const loginError = useSelector((state) => state.appState.loginError);
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );

  const {
    setError,
    error,
    username,
    password,
    handleError,
    handleUsernameChange,
    handlePasswordChange,
    invalidPasswordMess,
    invalidUsernameMess,
    handleMissingField,
  } = useValidateInput(true);

  const handleLogin = async (event) => {
    try {
      event.preventDefault();
      if (waitForResponse || waitForServer) return;
      setError("");
      const missingField = handleMissingField();
      if (!missingField && !invalidPasswordMess && !invalidUsernameMess) {
        setError(null);
        setWaitForResponse(true);
        const { message, user, ok, opponentID } = await callAPI(
          "POST",
          "api/login",
          {
            username: username,
            password: password,
          }
        );
        setWaitForResponse(false);
        if (user) {
          authenticateUser(dispatch, user, opponentID);
        } else handleError(ok, message);
      }
    } catch (err) {
      setWaitForResponse(false);
      handleError(false, err.toString());
    }
  };

  const handleLoginAsGuest = async () => {
    try {
      if (waitForResponse || waitForServer) return;
      setError("");
      if (isAuthenticated === "guest") setSuccessfullyLogin(true);
      else {
        setWaitForServer(true);
        const { user, opponentID } = await callAPI(
          "GET",
          "api/login-as-guest",
          null
        );
        setWaitForServer(false);
        setSuccessfullyLogin(true);
        authenticateUser(dispatch, user, opponentID);
      }
    } catch (err) {
      setWaitForServer(false);
      handleError(false, err.toString());
    }
  };

  if (loginError) handleError(false, loginError);
  else if (isAuthenticated) {
    if (isAuthenticated !== "guest") return <Redirect to="/" />;
    else if (successfullyLogin) return <Redirect to="/" />;
  }

  return (
    <Container fluid>
      <h1>Xiangqi</h1>
      <Row className="justify-content-center">
        <Col
          md={{ span: 7 }}
          sm={{ span: 7 }}
          xs={{ span: 10 }}
          className="login-component d-flex flex-column  align-items-center"
        >
          {error ? <p className="error-message">{error}</p> : null}
          <Form onSubmit={handleLogin} method="POST">
            <Form.Group controlId="username-or-email">
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  isInvalid={invalidUsernameMess !== ""}
                  placeholder="Username or Email"
                  onChange={handleUsernameChange}
                  value={username}
                  disabled={waitForResponse || waitForServer}
                />
                <Form.Control.Feedback type="invalid">
                  {invalidUsernameMess}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="password">
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  isInvalid={invalidPasswordMess !== ""}
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  value={password}
                  disabled={waitForResponse || waitForServer}
                />
                <Form.Control.Feedback type="invalid">
                  {invalidPasswordMess}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Button type="submit" className="submit-form-button">
              {waitForResponse ? (
                <Spinner animation="border" variant="dark" />
              ) : (
                "Log In"
              )}
            </Button>
            <Button className="log-in-as-guest" onClick={handleLoginAsGuest}>
              {waitForServer ? (
                <Spinner animation="border" variant="dark" />
              ) : (
                "Log In As Guest"
              )}
            </Button>
          </Form>
          <p className="seperator">
            <span></span>
            <span className="seperator-text">or connect with</span>
            <span></span>
          </p>
          <div className="social-login">
            <a className="google" href="http://localhost:8080/api/auth/google">
              <i className="fab fa-google"></i> Google
            </a>
            <a
              className="facebook"
              href="http://localhost:8080/api/auth/facebook"
            >
              <i className="fab fa-facebook "></i> Facebook
            </a>
            <a className="github" href="http://localhost:8080/api/auth/github">
              <i className="fab fa-github "></i> Github
            </a>
          </div>
          <div className="sign-up-area">
            <Link to="/signup">Sign Up</Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
