import React, { useState, useEffect, useContext } from "react";
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
import { Redirect } from "react-router-dom";
import { AuthenticateUserContext } from "../App/context.js";
import callAPI from "../App/callAPI.js";

const Signup = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );
  const authenticateUser = useContext(AuthenticateUserContext);
  const [invalidUsernameMess, setInvalidUsernameMess] = useState("");
  const [invalidEmailMess, setInvalidEmailMess] = useState("");
  const [invalidPasswordMess, setInvalidPasswordMess] = useState("");
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [invalidFirstname, setInvalidFirstname] = useState("");
  const [invalidLastname, setInvalidLastname] = useState("");
  const [checkingSession, setCheckingSession] = useState(false);
  const [lastname, setLastname] = useState("");

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    if (/[^_a-z0-9]/i.test(value) || value.length < 3 || value.length > 20) {
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

  const handleEmailChange = (event) => {
    const value = event.target.value;
    if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.\-]+$/.test(value) || /\.\./.test(value))
      setInvalidEmailMess("Invalid email address");
    else setInvalidEmailMess("");
    setEmail(value);
  };

  const handleFirstnameChange = (event) => {
    const value = event.target.value;
    if (/[^ _a-z]/i.test(value))
      setInvalidFirstname("Firstname can only contain letter, space and _");
    else setInvalidFirstname("");
    setFirstname(value);
  };
  const handleLastnameChange = (event) => {
    const value = event.target.value;
    if (/[^ _a-z]/i.test(value) || /[^a-z]/i.test(value[0])) {
      if (/[^a-z]/i.test(value[0]))
        setInvalidLastname("First letter must be letter");
      else setInvalidLastname("Lastname can only contain letter, space and _");
    } else setInvalidLastname("");
    setLastname(value);
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
    if (!firstname) {
      count += 1;
      setInvalidFirstname("Please fill out this field");
    }
    if (!lastname) {
      count += 1;
      setInvalidLastname("Please fill out this field");
    }
    if (!email) {
      count += 1;
      setInvalidEmailMess("Please fill out this field");
    }
    return count !== 0;
  };

  const handleError = (ok, message) => {
    if (!ok) {
      setError(message);
    } else if (/Email/.test(message)) {
      setInvalidEmailMess(message);
    } else if (/User/.test(message)) {
      setInvalidUsernameMess(message);
    } else setError(message);
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const missingField = handleMissingField();
    if (
      !missingField &&
      !invalidEmailMess &&
      !invalidPasswordMess &&
      !invalidUsernameMess &&
      !invalidFirstname &&
      !invalidLastname
    ) {
      setWaitForResponse(true);
      setError(null);
      const { message, user, ok, sessionID } = await callAPI(
        "POST",
        "/signup",
        {
          email: email,
          firstname: firstname,
          username: username,
          password: password,
          lastname: lastname,
        }
      );
      setWaitForResponse(false);
      if (user) {
        authenticateUser(dispatch, user, sessionID);
      } else handleError(ok, message);
    }
  };

  useEffect(async () => {
    setCheckingSession(true);
    const { user } = await callAPI("GET", "/", null);
    setCheckingSession(false);
    if (user) {
      authenticateUser(dispatch, user);
    }
  }, [isAuthenticated]);

  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <Container fluid>
      <h1>Xiangqi</h1>
      {checkingSession ? (
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
        <Row className="justify-content-center">
          <Col
            md={{ span: 4 }}
            sm={{ span: 6 }}
            xs={{ span: 10 }}
            className="login-component d-flex flex-column  align-items-center"
          >
            {error ? <p className="error-message">{error}</p> : null}
            <Form onSubmit={handleSignUp} method="POST">
              <Form.Group controlId="username">
                <Form.Label style={{ float: "left" }}>Username</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    isInvalid={invalidUsernameMess !== ""}
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

              <Form.Group controlId="firstname">
                <Form.Label style={{ float: "left" }}>Firstname</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    isInvalid={invalidFirstname !== ""}
                    onChange={handleFirstnameChange}
                    value={firstname}
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ textAlign: "left" }}
                  >
                    {invalidFirstname}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="lastname">
                <Form.Label style={{ float: "left" }}>Lastname</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    isInvalid={invalidLastname !== ""}
                    onChange={handleLastnameChange}
                    value={lastname}
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ textAlign: "left" }}
                  >
                    {invalidLastname}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label style={{ float: "left" }}>Email</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="text"
                    isInvalid={invalidEmailMess !== ""}
                    onChange={handleEmailChange}
                    value={email}
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ textAlign: "left" }}
                  >
                    {invalidEmailMess}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group controlId="password">
                <Form.Label style={{ float: "left" }}>Password</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    isInvalid={invalidPasswordMess !== ""}
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
                  "Submit"
                )}
              </Button>
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
              <a
                className="facebook"
                href="http://localhost:8080/auth/facebook"
              >
                <i className="fab fa-facebook "></i> Facebook
              </a>
              <a className="github" href="http://localhost:8080/auth/github">
                <i className="fab fa-github "></i> Github
              </a>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Signup;
