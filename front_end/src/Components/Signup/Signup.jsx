import React, { useState, useContext } from "react";
import useValidateInput from "./useValidateInput.js";
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
  const lang = useSelector((state) => state.appState.lang);
  const authenticateUser = useContext(AuthenticateUserContext);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const {
    handleEmailChange,
    handleError,
    setError,
    handleFirstnameChange,
    handleLastnameChange,
    handleMissingField,
    handleUsernameChange,
    handlePasswordChange,
    username,
    password,
    lastname,
    firstname,
    email,
    invalidEmailMess,
    invalidPasswordMess,
    invalidUsernameMess,
    error,
    showPassword,
    setShowPassword,
    confirmPassword,
    handleConfirmPasswordChange,
    confirmPasswordMess,
    setConfirmPasswordMess,
  } = useValidateInput(false, false, lang);

  const handleSignUp = async (event) => {
    try {
      event.preventDefault();
      if (waitForResponse) return;
      setError("");
      const missingField = handleMissingField();
      if (confirmPassword !== password) {
        setConfirmPasswordMess(
          lang === "English" ? "Password doesn't match" : "Mật khẩu không khớp"
        );
        return;
      }
      if (
        !missingField &&
        !invalidEmailMess &&
        !invalidPasswordMess &&
        !invalidUsernameMess &&
        !confirmPasswordMess
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
      <h1>{lang === "English" ? "Xiangqi" : "Cờ Tướng"}</h1>(
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
              <Form.Label>
                {lang === "English" ? "Username" : "Tên tài khoản"}
              </Form.Label>
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
              <Form.Label>{lang === "English" ? "Firstname" : "Họ"}</Form.Label>
              <Form.Control
                type="text"
                onChange={handleFirstnameChange}
                value={firstname}
                disabled={waitForResponse}
              />
            </Form.Group>

            <Form.Group controlId="lastname">
              <Form.Label>{lang === "English" ? "Lastname" : "tên"}</Form.Label>
              <Form.Control
                type="text"
                onChange={handleLastnameChange}
                value={lastname}
                disabled={waitForResponse}
              />
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
              <Form.Label>
                {lang === "English" ? "Password" : "Mật Khẩu"}
              </Form.Label>
              <InputGroup hasValidation className="password-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  isInvalid={invalidPasswordMess !== ""}
                  onChange={handlePasswordChange}
                  value={password}
                  disabled={waitForResponse}
                />
                <Form.Control.Feedback type="invalid">
                  {invalidPasswordMess}
                </Form.Control.Feedback>
                <button
                  className="toggle-password"
                  type="button"
                  style={{ display: invalidPasswordMess ? "none" : "inline" }}
                  onClick={() => {
                    setShowPassword(!showPassword);
                  }}
                >
                  {showPassword
                    ? lang === "English"
                      ? "Hide"
                      : "Ẩn"
                    : lang === "English"
                    ? "Show"
                    : "Hiện"}
                </button>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                {lang === "English" ? "Confirm Password" : "Xác nhận mật khẩu"}
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  isInvalid={confirmPasswordMess !== ""}
                  disabled={waitForResponse}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                <Form.Control.Feedback type="invalid">
                  {confirmPasswordMess}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Button type="submit" className="submit-form-button">
              {waitForResponse ? (
                <Spinner animation="border" variant="dark" />
              ) : lang === "English" ? (
                "Submit"
              ) : (
                "Đăng Ký"
              )}
            </Button>
          </Form>
          <p className="seperator">
            <span></span>
            <span className="seperator-text">
              {lang === "English" ? "or connect with" : "hoặc đăng nhập với"}
            </span>
            <span></span>
          </p>
          <div className="social-login">
            <a
              className="google"
              href="https://co-tuong-online.herokuapp.com/api/auth/google"
            >
              <i className="fab fa-google"></i> Google
            </a>
            <a
              className="facebook"
              href="https://co-tuong-online.herokuapp.com/api/auth/facebook"
            >
              <i className="fab fa-facebook "></i> Facebook
            </a>
            <a
              className="github"
              href="https://co-tuong-online.herokuapp.com/api/auth/github"
            >
              <i className="fab fa-github "></i> Github
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
