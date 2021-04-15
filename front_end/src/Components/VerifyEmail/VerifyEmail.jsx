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
  const lang = useSelector((state) => state.appState.lang);
  const playerInfo = useSelector((state) => state.appState.playerInfo);

  const handleVerificationCodeChange = (event) => {
    const value = event.target.value;
    if (/[^0-9]/.test(value))
      setInvalidCodeMess(
        lang === "English"
          ? "Invalid verification code"
          : "Mã xác nhận không hợp lí"
      );
    else setInvalidCodeMess("");
    setVerficationCode(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (waitForResponse || waitForSendingCode) return;
    if (!verificationCode)
      setInvalidCodeMess(
        lang === "English"
          ? "Please fill in this field"
          : "Xin hãy điền thông tin này"
      );
    else if (!invalidCodeMess) {
      setError(null);
      setWaitForResponse(true);
      const { message, ok, user } = await callAPI(
        "POST",
        "api/verify-email/code",
        {
          username: playerInfo.username,
          correct: +codeRef.current === +verificationCode,
        }
      );
      setWaitForResponse(false);
      if (!ok) setError(message);
      else if (user) {
        setVerified(true);
        dispatch({ type: "setPlayerInfo", value: user });
      } else if (message === "Incorrect Code")
        setInvalidCodeMess(
          lang === "English" ? "Incorrect Code" : "Mã xác nhận không chính xác"
        );
      else setError(message);
    }
  };

  const sendVerificationCode = async () => {
    if (waitForResponse || waitForSendingCode) return;
    if (!resend) setResend(true);
    setWaitForSendingCode(true);
    setError("");
    const lastname = playerInfo.name.lastname;
    const { message, code, ok } = await callAPI("POST", "api/verify-email", {
      email: playerInfo.email.value,
      lastname: lastname ? lastname : playerInfo.username,
    });
    setWaitForSendingCode(false);
    if (!ok) setError(message);
    else codeRef.current = code;
  };

  if (!playerInfo || verified) return <Redirect to="/" />;

  return (
    <Container fluid>
      <h1>{lang === "English" ? "Xiangqi" : "Cờ Tướng"}</h1>
      <Row className="justify-content-center">
        <Col
          lg={{ span: 3 }}
          md={{ span: 4 }}
          xs={{ span: 8 }}
          className="login-component d-flex flex-column  align-items-center"
        >
          {error ? <p className="error-message">{error}</p> : null}
          <Form onSubmit={handleSubmit} method="POST">
            <Form.Group controlId="verificationCode">
              <Form.Label style={{ float: "left" }}>
                {lang === "English"
                  ? "Enter your verification code"
                  : "Nhập mã xác nhận"}
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  name="verificationCode"
                  isInvalid={invalidCodeMess !== ""}
                  onChange={handleVerificationCodeChange}
                  value={verificationCode}
                  disabled={waitForResponse || waitForSendingCode}
                  placeholder={
                    lang === "English" ? "Verification Code" : "Mã Xác Nhận"
                  }
                />
                <Form.Control.Feedback
                  type="invalid"
                  style={{ textAlign: "left" }}
                >
                  {invalidCodeMess}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button type="submit" className="submit-form-button">
              {waitForResponse ? (
                <Spinner animation="border" variant="dark" />
              ) : lang === "English" ? (
                "Submit"
              ) : (
                "Xác Nhận Email"
              )}
            </Button>
            <Button
              onClick={sendVerificationCode}
              style={{ marginTop: "10px" }}
              className="submit-form-button"
            >
              {waitForSendingCode ? (
                <Spinner animation="border" variant="dark" />
              ) : resend ? (
                lang === "English" ? (
                  "Resend Verification Code"
                ) : (
                  "Gửi lại Mã Xác Nhận"
                )
              ) : lang === "English" ? (
                "Send Verification Code"
              ) : (
                "Gửi Mã Xác Nhận"
              )}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyEmail;
