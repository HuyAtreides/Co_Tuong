import React, { useState, useContext } from "react";
import { SocketContext } from "../App/context.js";
import callAPI from "../App/callAPI.js";
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
import "./Login.scss";

const Login = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const [invalidUsernameMess, setInvalidUsernameMess] = useState("");
  const [invalidPasswordMess, setInvalidPasswordMess] = useState("");
  const [error, setError] = useState(false);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    if (/[^ _a-z0-9]/i.test(value) || value.length < 3 || value.length > 20) {
      setInvalidUsernameMess(
        "Username must be between 3-20 characters long and use only Latin letters and numbers"
      );
    } else setInvalidUsernameMess("");
    setUsername(value);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    if (value.length < 6) {
      setInvalidPasswordMess("Password must be atlest 6 characters");
    } else setInvalidPasswordMess("");
    setPassword(value);
  };
  const handleMissingField = () => {
    let count = 0;
    if (!username) {
      count += 1;
      setInvalidUsernameMess("Please fill out this field");
    }
    if (!password) {
      count += 1;
      setInvalidPasswordMess("Please fill out this field");
    }
    return count !== 0;
  };

  const handleError = (ok, message) => {
    if (!ok) {
      setError(message);
    } else if (/Password/.test(message)) {
      setInvalidPasswordMess(message);
    } else if (/Username/.test(message)) {
      setInvalidUsernameMess(message);
    } else setError(message);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const missingField = handleMissingField();
    if (!missingField && !invalidPasswordMess && !invalidUsernameMess) {
      setError(null);
      setWaitForResponse(true);
      const { message, user, ok } = await callAPI("POST", "/login", {
        username: username,
        password: password,
      });
      setWaitForResponse(false);
      if (user) {
        dispatch({ type: "setIsAuthenticated", value: true });
        dispatch({ type: "setPlayerInfo", value: user });
        socket.auth = {
          playername: user.username,
          photo: user.photo,
        };
        socket.connect();
      } else handleError(ok, message);
    }
  };

  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <Container fluid>
      <h1>Xiangqi</h1>
      <Row className="justify-content-center">
        <Col
          md={{ span: 4 }}
          sm={{ span: 6 }}
          xs={{ span: 10 }}
          className="login-component d-flex flex-column  align-items-center"
        >
          {error ? <p className="error-message">{error}</p> : null}
          <Form onSubmit={handleLogin} method="POST">
            <Form.Group controlId="username-or-email">
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  required
                  isInvalid={invalidUsernameMess !== ""}
                  placeholder="Username or Email"
                  onChange={handleUsernameChange}
                  value={username}
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ textAlign: "left" }}
                >
                  {invalidUsernameMess}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="password">
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  required
                  isInvalid={invalidPasswordMess !== ""}
                  placeholder="Password"
                  onChange={handlePasswordChange}
                  value={password}
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ textAlign: "left" }}
                >
                  {invalidPasswordMess}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Button type="submit">
              {waitForResponse ? (
                <Spinner animation="border" variant="dark" />
              ) : (
                "Log In"
              )}
            </Button>
            <Button className="log-in-as-guest">Log In As Guest</Button>
          </Form>
          <p className="seperator">
            <span></span>
            <span className="seperator-text">or connect with</span>
            <span></span>
          </p>
          <div className="social-login">
            <a className="google" href="http://localhost:8080/auth/google">
              <i className="fab fa-google"></i> Google
            </a>
            <a className="facebook" href="http://localhost:8080/auth/facebook">
              <i className="fab fa-facebook "></i> Facebook
            </a>
            <a className="github" href="http://localhost:8080/auth/github">
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
