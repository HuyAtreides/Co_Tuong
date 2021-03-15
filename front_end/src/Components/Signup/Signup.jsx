import React, { useState } from "react";
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
import callAPI from "../App/callAPI.js";

const Signup = (props) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );
  const [verify, setVerify] = useState(false);
  const [invalidUsernameMess, setInvalidUsernameMess] = useState("");
  const [invalidEmailMess, setInvalidEmailMess] = useState("");
  const [invalidPasswordMess, setInvalidPasswordMess] = useState("");
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [error, setError] = useState(null);
  const [verificationCode, setVerficationCode] = useState("");
  const [invalidCodeMess, setInvalidCodeMess] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const handleVerificationCodeChange = (event) => {};
  const handleUsernameChange = (event) => {};

  const handlePasswordChange = (event) => {};

  const handleEmailChange = (event) => {};

  const handleFirstnameChange = (event) => {};

  const handleLastnameChange = (event) => {};

  if (isAuthenticated) return <Redirect to="/" />;

  return (
    <Container fluid>
      <h1>Xiangqi</h1>
      <Row className="justify-content-center">
        <Col
          md={{ span: 3 }}
          xs={{ span: 10 }}
          className="login-component d-flex flex-column  align-items-center"
        >
          {error ? <p className="error-message">{error}</p> : null}
          <Form>
            <Form.Group
              controlId="username"
              style={{ display: verify ? "none" : "block" }}
            >
              <Form.Label style={{ float: "left" }}>Username</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  required
                  isInvalid={invalidUsernameMess !== ""}
                  onChange={handleUsernameChange}
                  value={username}
                />
                <Form.Control.Feedback type="invalid">
                  {invalidUsernameMess}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group
              controlId="firstname"
              style={{ display: verify ? "none" : "block" }}
            >
              <Form.Label style={{ float: "left" }}>Firstname</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  required
                  onChange={handleFirstnameChange}
                  value={firstname}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group
              controlId="lastname"
              style={{ display: verify ? "none" : "block" }}
            >
              <Form.Label style={{ float: "left" }}>Lastname</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  required
                  onChange={handleLastnameChange}
                  value={lastname}
                />
              </InputGroup>
            </Form.Group>

            <Form.Group
              controlId="email"
              style={{ display: verify ? "none" : "block" }}
            >
              <Form.Label style={{ float: "left" }}>Email</Form.Label>

              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  required
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
            <Form.Group
              controlId="password"
              style={{ display: verify ? "none" : "block" }}
            >
              <Form.Label style={{ float: "left" }}>Password</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  required
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

            <Form.Group
              controlId="verificationCode"
              style={{ display: !verify ? "none" : "block" }}
            >
              <Form.Label style={{ float: "left" }}>
                Enter your verification code
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  required
                  isInvalid={invalidCodeMess !== ""}
                  onChange={handleVerificationCodeChange}
                  value={verificationCode}
                  placeholder="Verification Code"
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ textAlign: "left" }}
                >
                  {invalidCodeMess}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button type="submit">
              {waitForResponse ? (
                <Spinner animation="border" variant="dark" />
              ) : !verify ? (
                "Create Account"
              ) : (
                "Submit"
              )}
            </Button>
            <Button
              style={{ display: !verify ? "none" : "inline", marginTop: "7px" }}
            >
              Resend
            </Button>
          </Form>
          <p
            className="seperator"
            style={{ display: verify ? "none" : "flex" }}
          >
            <span></span>
            <span className="seperator-text">or connect with</span>
            <span></span>
          </p>
          <div
            className="social-login"
            style={{ display: verify ? "none" : "flex" }}
          >
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
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
