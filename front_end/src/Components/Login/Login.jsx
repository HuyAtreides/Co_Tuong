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
import { Link } from "react-router-dom";
import "./Login.scss";

const Login = (props) => {
  const [login, setLogin] = useState(false);
  const [invalidUsernameMess, setInvalidUsernameMess] = useState("");
  const [invalidPasswordMess, setInvalidPasswordMess] = useState("");
  const [waitForData, setWaitForData] = useState(false);
  return (
    <Container fluid>
      <h1>Xiangqi</h1>
      <Row className="justify-content-center">
        <Col
          md={{ span: 3 }}
          xs={{ span: 10 }}
          className="login-component d-flex flex-column  align-items-center"
        >
          <Form>
            <Form.Group controlId="username-or-email">
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  required
                  isInvalid={invalidUsernameMess !== ""}
                  placeholder="Username or Email"
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
                  required
                  isInvalid={invalidPasswordMess !== ""}
                  placeholder="Password"
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
              {waitForData ? (
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
            <a className="google" href="/login-with-google">
              <i className="fab fa-google"></i> Google
            </a>
            <a className="facebook" href="/login-with-facebook">
              <i className="fab fa-facebook "></i> Facebook
            </a>
            <a className="github" href="/login-with-github">
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
