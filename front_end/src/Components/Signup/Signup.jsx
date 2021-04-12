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

  const [lastname, setLastname] = useState("");

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    if (/[^_a-z0-9-]/i.test(value) || value.length < 3 || value.length > 20) {
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
    setInvalidFirstname("");
    setFirstname(value);
  };
  const handleLastnameChange = (event) => {
    const value = event.target.value;
    if (
      /[^a-zA-ZÁáÀàẢảÃãẠạĂăẮắẰằẲẳẴẵẶặÂâẤấẦầẨẩẪẫẬậĐđÉéÈèẺẻẼẽẸẹÊêẾếỀềỂểỄễỆệÍíÌìỈỉĨĩỊịÓóÒòỎỏÕõỌọÔôỐốỒồỔổỖỗỘộƠơỚớỜờỞởỠỡỢợÚúÙùỦủŨũỤụƯưỨứỪừỬửỮữỰựÝýỲỳỶỷỸỹỴỵ]/.test(
        value[0]
      )
    )
      setInvalidLastname("First character must be a latin letter");
    else setInvalidLastname("");
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
    try {
      event.preventDefault();
      if (waitForResponse) return;
      setError("");
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
        const { message, user, ok, opponentID } = await callAPI(
          "POST",
          "api/signup",
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
          authenticateUser(dispatch, user, opponentID);
        } else handleError(ok, message);
      }
    } catch (err) {
      setWaitForResponse(false);
      handleError(false, err.toString());
    }
  };

  if (isAuthenticated) {
    if (isAuthenticated !== "guest") return <Redirect to="/" />;
  }

  return (
    <Container fluid>
      <h1>Xiangqi</h1>(
      <Row className="justify-content-center">
        <Col
          md={{ span: 7 }}
          sm={{ span: 7 }}
          xs={{ span: 10 }}
          className="login-component d-flex flex-column  align-items-center"
        >
          {error ? <p className="error-message">{error}</p> : null}
          <Form onSubmit={handleSignUp} method="POST">
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  isInvalid={invalidUsernameMess !== ""}
                  onChange={handleUsernameChange}
                  value={username}
                  disabled={waitForResponse}
                />
                <Form.Control.Feedback type="invalid">
                  {invalidUsernameMess}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="firstname">
              <Form.Label>Firstname</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  isInvalid={invalidFirstname !== ""}
                  onChange={handleFirstnameChange}
                  value={firstname}
                  disabled={waitForResponse}
                />
                <Form.Control.Feedback type="invalid">
                  {invalidFirstname}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="lastname">
              <Form.Label>Lastname</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  isInvalid={invalidLastname !== ""}
                  onChange={handleLastnameChange}
                  value={lastname}
                  disabled={waitForResponse}
                />
                <Form.Control.Feedback type="invalid">
                  {invalidLastname}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="email"
                  isInvalid={invalidEmailMess !== ""}
                  onChange={handleEmailChange}
                  value={email}
                  disabled={waitForResponse}
                />
                <Form.Control.Feedback type="invalid">
                  {invalidEmailMess}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  isInvalid={invalidPasswordMess !== ""}
                  onChange={handlePasswordChange}
                  value={password}
                  disabled={waitForResponse}
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
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
