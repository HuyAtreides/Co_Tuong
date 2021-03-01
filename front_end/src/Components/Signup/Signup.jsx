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

const Signup = (props) => {
  const [invalidUsernameMess, setInvalidUsernameMess] = useState("");
  const [invalidEmailMess, setInvalidEmailMess] = useState("");
  const [invalidPasswordMess, setInvalidPasswordMess] = useState("");
  const [waitForData, setWaitForData] = useState(false);

  return (
    <Container fluid>
      <h1>Join Now</h1>
      <Row className="justify-content-center">
        <Col
          md={{ span: 3 }}
          xs={{ span: 10 }}
          className="login-component d-flex flex-column  align-items-center"
        >
          <Form>
            <Form.Group controlId="username">
              <Form.Label style={{ float: "left" }}>Username</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  required
                  isInvalid={invalidUsernameMess !== ""}
                />
                <Form.Control.Feedback type="invalid">
                  {invalidUsernameMess}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label style={{ float: "left" }}>Email</Form.Label>

              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  required
                  isInvalid={invalidEmailMess !== ""}
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
                  required
                  isInvalid={invalidPasswordMess !== ""}
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
                "Create Account"
              )}
            </Button>
          </Form>
          <p className="seperator">
            <span></span>
            <span className="seperator-text">or connect with</span>
            <span></span>
          </p>
          <div className="social-login">
            <a
              className="google"
              href="http://localhost:8080/login-with-google"
            >
              <i className="fab fa-google"></i> Google
            </a>
            <a
              className="facebook"
              href="http://localhost:8080/login-with-facebook"
            >
              <i className="fab fa-facebook "></i> Facebook
            </a>
            <a
              className="github"
              href="http://localhost:8080/login-with-github"
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
