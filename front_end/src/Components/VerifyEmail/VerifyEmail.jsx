import React, { useState, useRef } from "react";
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
import callAPI from "../App/callAPI.js";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);
  const [waitForResponse, setWaitForResponse] = useState(false);
  const [resend, setResend] = useState(false);
  const [verificationCode, setVerficationCode] = useState("");
  const [invalidCodeMess, setInvalidCodeMess] = useState("");
  const [error, setError] = useState("");
  const [waitForSendingCode, setWaitForSendingCode] = useState(false);
  const codeRef = useRef();
  const playerInfo = useSelector((state) => state.appState.playerInfo);

  const handleVerificationCodeChange = (event) => {
    const value = event.target.value;
    if (/[^0-9]/.test(value) || value.length > 5)
      setInvalidCodeMess("Invalid verification code");
    else setInvalidCodeMess("");
    setVerficationCode(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!verificationCode) setInvalidCodeMess("Please fill in this field");
    else if (!invalidCodeMess) {
      setWaitForResponse(true);
      const { message, ok, user } = await callAPI("POST", "verify-email/code", {
        username: playerInfo.username,
        correct: +codeRef.current === +verificationCode,
      });
      setWaitForResponse(false);
      if (!ok) setError(message);
      else if (user) {
        setVerified(true);
        dispatch({ type: "setPlayerInfo", value: user });
      } else if (+codeRef.current !== +verificationCode)
        setInvalidCodeMess("Incorrect Code");
      else setError(message);
    }
  };

  const sendVerificationCode = async () => {
    if (!resend) setResend(true);
    setWaitForSendingCode(true);
    setError("");
    const { message, code, ok } = await callAPI("POST", "verify-email", {
      email: playerInfo.email.value,
      lastname: playerInfo.name.lastname,
    });
    setWaitForSendingCode(false);
    if (!ok) setError(message);
    else codeRef.current = code;
  };

  if (!playerInfo || verified) return <Redirect to="/" />;

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
          <Form onSubmit={handleSubmit} method="POST">
            <Form.Group controlId="verificationCode">
              <Form.Label style={{ float: "left" }}>
                Enter your verification code
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  name="verificationCode"
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
              ) : (
                "Submit"
              )}
            </Button>
            <Button
              onClick={sendVerificationCode}
              style={{ marginTop: "10px" }}
            >
              {waitForSendingCode ? (
                <Spinner animation="border" variant="dark" />
              ) : resend ? (
                "Resend Verification Code"
              ) : (
                "Send Verification Code"
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyEmail;
