import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Container, Row, Col, InputGroup, Spinner, Button } from 'react-bootstrap';
import NavBar from '../Main/NavBar/NavBar.jsx';
import './Settings.scss';
import callAPI from '../App/callAPI.js';
import useValidateInput from '../Signup/useValidateInput.js';
import ProfileHeader from '../Home/ProfileHeader/ProfileHeader.jsx';

const Settings = () => {
  const dispatch = useDispatch();
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const lang = useSelector((state) => state.appState.lang);
  const [buttonText, setButtonText] = useState(lang === 'English' ? 'Save' : 'Lưu');
  const [uploadErr, setUploadErr] = useState(null);
  const [waitForServer, setWaitForServer] = useState(false);
  const validateInput = useValidateInput(false, true, lang);
  const [waitForResponse, setWaitForResponse] = useState(false);

  const getChanges = () => {
    const changes = {};
    const { username, email, lastname, firstname } = validateInput;
    if (playerInfo.username !== username) changes['username'] = username;
    if (!playerInfo.provider && playerInfo.email.value !== email) {
      changes['email'] = { value: email, verified: true };
    }
    changes['name.lastname'] = lastname;
    changes['name.firstname'] = firstname;
    if (validateInput.password) changes['password'] = validateInput.password;
    return changes;
  };

  const handleSaveChange = async (event) => {
    try {
      event.preventDefault();
      if (waitForServer) return;
      setUploadErr('');
      validateInput.setError(null);
      const { password, confirmPassword } = validateInput;
      const missingField = validateInput.handleMissingField(!playerInfo.email.value);
      if (password !== confirmPassword) {
        validateInput.setConfirmPasswordMess(
          lang === 'English' ? "Password doesn't match" : 'Mật khẩu không khớp',
        );
        return;
      }
      if (
        !missingField &&
        !validateInput.invalidEmailMess &&
        !validateInput.invalidPasswordMess &&
        !validateInput.invalidUsernameMess &&
        !validateInput.confirmPasswordMess
      ) {
        const changes = getChanges();
        setWaitForServer(true);
        const { user, message, ok } = await callAPI('POST', 'api/signup/settings', {
          changes: changes,
          currentPassword: validateInput.currentPassword,
          user: playerInfo.username,
        });
        setWaitForServer(false);
        if (user) {
          dispatch({ type: 'setPlayerInfo', value: user });
          setButtonText(
            lang === 'English'
              ? 'Your settings have been saved.'
              : 'Thay đổi của bạn đã được lưu',
          );
          setTimeout(() => {
            setButtonText(lang === 'English' ? 'Save' : 'Lưu');
          }, 1000);
        } else if (message) validateInput.handleError(ok, message);
      }
    } catch (err) {
      setWaitForServer(false);
      setUploadErr(err.message);
    }
  };

  useEffect(() => {
    if (playerInfo) {
      const { username, email, name } = playerInfo;
      validateInput.setUsername(username ? username : '');
      validateInput.setEmail(email.value ? email.value : '');
      validateInput.setLastname(name.lastname ? name.lastname : '');
      validateInput.setFirstname(name.firstname ? name.firstname : '');
    }
  }, []);

  if (!playerInfo) return <Redirect to='/' />;

  if (waitForResponse)
    return <Spinner animation='border' variant='secondary' className='spinner' />;

  return (
    <Container fluid className='settings-container'>
      <NavBar setWaitForResponse={setWaitForResponse} />
      <Row className='home-row mt-3'>
        <p
          className='upload-pic-err'
          style={{
            display: uploadErr || validateInput.error ? 'block' : ' none',
          }}
        >
          <i
            className='fas fa-times'
            onClick={() => {
              validateInput.setError(null);
              setUploadErr(null);
            }}
          ></i>
          {uploadErr ? uploadErr : validateInput.error}
        </p>
        <Col xs={11} md={7}>
          <ProfileHeader setError={setUploadErr} setting={true} playerInfo={playerInfo} />
          <Form
            className='mt-3 mb-3 settings-form'
            method='POST'
            onSubmit={handleSaveChange}
          >
            <Form.Group as={Row} className='mt-4 form-group-row'>
              <Form.Label column xs={12} lg={2}>
                {lang === 'English' ? 'Username' : 'Tên tài khoản'}
              </Form.Label>
              <Col sm={12} lg={10}>
                <InputGroup hasValidation>
                  <Form.Control
                    type='text'
                    value={validateInput.username}
                    onChange={validateInput.handleUsernameChange}
                    isInvalid={validateInput.invalidUsernameMess !== ''}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {validateInput.invalidUsernameMess}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className='mt-4 form-group-row'>
              <Form.Label column xs={12} lg={2}>
                Email
              </Form.Label>
              <Col sm={12} lg={10}>
                <InputGroup hasValidation>
                  <Form.Control
                    type='email'
                    value={validateInput.email}
                    onChange={validateInput.handleEmailChange}
                    isInvalid={validateInput.invalidEmailMess !== ''}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {validateInput.invalidEmailMess}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Form.Group as={Row} className='mt-4 form-group-row'>
              <Form.Label column xs={12} lg={2}>
                {lang === 'English' ? 'Firstname' : 'Họ'}
              </Form.Label>
              <Col sm={12} lg={10}>
                <Form.Control
                  type='text'
                  value={validateInput.firstname}
                  onChange={validateInput.handleFirstnameChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className='mt-4 form-group-row'>
              <Form.Label column xs={12} lg={2}>
                {lang === 'English' ? 'Lastname' : 'Tên'}
              </Form.Label>
              <Col sm={12} lg={10}>
                <Form.Control
                  type='text'
                  value={validateInput.lastname}
                  onChange={validateInput.handleLastnameChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className='mt-4 form-group-row'>
              <Form.Label column xs={12} lg={2}>
                {lang === 'English' ? 'Current Password' : 'Mật khẩu hiện tại'}
              </Form.Label>
              <Col sm={12} lg={10}>
                <InputGroup hasValidation>
                  <Form.Control
                    type='password'
                    value={validateInput.currentPassword}
                    onChange={validateInput.handleCurrentPasswordChange}
                    isInvalid={validateInput.invalidCurrentPassword !== ''}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {validateInput.invalidCurrentPassword}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className='mt-4 form-group-row'>
              <Form.Label column xs={12} lg={2}>
                {lang === 'English' ? 'New Password' : 'Mật khẩu mới'}
              </Form.Label>
              <Col sm={12} lg={10}>
                <InputGroup hasValidation className='password-group'>
                  <Form.Control
                    type={validateInput.showPassword ? 'text' : 'password'}
                    value={validateInput.password}
                    isInvalid={validateInput.invalidPasswordMess !== ''}
                    onChange={validateInput.handlePasswordChange}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {validateInput.invalidPasswordMess}
                  </Form.Control.Feedback>
                  <button
                    className='toggle-password'
                    type='button'
                    style={{
                      display: validateInput.invalidPasswordMess ? 'none' : 'inline',
                    }}
                    onClick={() => {
                      validateInput.setShowPassword(!validateInput.showPassword);
                    }}
                  >
                    {validateInput.showPassword ? 'Hide' : 'Show'}
                  </button>
                </InputGroup>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className='mt-4 form-group-row'>
              <Form.Label column xs={12} lg={2}>
                {lang === 'English' ? 'Confirm New Password' : 'Xác nhận mật khẩu mới'}
              </Form.Label>
              <Col sm={12} lg={10}>
                <InputGroup hasValidation>
                  <Form.Control
                    type='password'
                    value={validateInput.confirmPassword}
                    onChange={validateInput.handleConfirmPasswordChange}
                    isInvalid={validateInput.confirmPasswordMess !== ''}
                  />
                  <Form.Control.Feedback type='invalid'>
                    {validateInput.confirmPasswordMess}
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Form.Group>
            <Col className='mt-4'>
              <Button type='submit' className='submit-form-button'>
                {waitForServer ? (
                  <Spinner animation='border' variant='dark' />
                ) : (
                  buttonText
                )}
              </Button>
            </Col>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
