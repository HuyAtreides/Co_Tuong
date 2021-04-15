import { useState } from "react";

const useValidateInput = (isSignIn, settings, lang) => {
  const [invalidUsernameMess, setInvalidUsernameMess] = useState("");
  const [invalidEmailMess, setInvalidEmailMess] = useState("");
  const [invalidPasswordMess, setInvalidPasswordMess] = useState("");
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordMess, setConfirmPasswordMess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [invalidCurrentPassword, setInvalidCurrentPassword] = useState("");

  const handleCurrentPasswordChange = (event) => {
    const value = event.currentTarget.value;
    setInvalidCurrentPassword("");
    setCurrentPassword(value);
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.currentTarget.value;
    if (value !== password) {
      setConfirmPasswordMess(
        lang === "English" ? "Password doesn't match" : "Mật khẩu không khớp"
      );
    } else setConfirmPasswordMess("");
    setConfirmPassword(value);
  };

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    if (
      !isSignIn &&
      value &&
      (/[^_a-z0-9-]/i.test(value) || value.length < 3 || value.length > 20)
    ) {
      setInvalidUsernameMess(
        lang === "English"
          ? "Username must be between 3-20 characters long and use only Latin letters and numbers"
          : "Tên tài khoản phải đó độ dài từ 3-20 và chỉ chứa chữ Latin và số."
      );
    } else setInvalidUsernameMess("");
    setUsername(value);
  };

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    if (!isSignIn && value && value.length < 6) {
      setInvalidPasswordMess(
        lang === "English"
          ? "Password must be atlest 6 characters"
          : "Mật khẩu phải có ít nhật 6 ký tự"
      );
    } else setInvalidPasswordMess("");
    setInvalidCurrentPassword("");
    setConfirmPasswordMess("");
    setPassword(value);
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9_.\-]+$/.test(value) || /\.\./.test(value))
      setInvalidEmailMess(
        lang === "English"
          ? "Invalid email address"
          : "Địa chỉ email không hợp lệ"
      );
    else setInvalidEmailMess("");
    setEmail(value);
  };

  const handleFirstnameChange = (event) => {
    const value = event.target.value;
    setFirstname(value);
  };
  const handleLastnameChange = (event) => {
    const value = event.target.value;
    setLastname(value);
  };

  const handleMissingField = (dontHaveEmail) => {
    let count = 0;
    const message =
      lang === "English"
        ? "Please fill out this field"
        : "Xin hãy điền thông tin này";
    if (!username) {
      count += 1;
      setInvalidUsernameMess(message);
    }
    if (!password && !settings) {
      count += 1;
      setInvalidPasswordMess(message);
    }
    if (!currentPassword && settings && password) {
      count += 1;
      setInvalidCurrentPassword(message);
    }

    if (!email && !isSignIn && !dontHaveEmail) {
      count += 1;
      setInvalidEmailMess(message);
    }
    return count !== 0;
  };

  const handleError = (ok, message) => {
    if (!ok) {
      setError(message);
    } else if (/Email/.test(message) && !isSignIn) {
      setInvalidEmailMess(
        lang === "English" ? message : "Email đã được sử dụng"
      );
    } else if (/User/.test(message)) {
      setInvalidUsernameMess(
        lang === "English" ? message : "Tên tài khoản đã được sử dụng"
      );
    } else if (/Password/.test(message)) {
      const invalidMess =
        lang === "English" ? message : "Mật khảu không chính xác";
      if (settings) setInvalidCurrentPassword(invalidMess);
      else setInvalidPasswordMess(invalidMess);
    } else setError(message);
  };

  return {
    handleEmailChange,
    handleError,
    setError,
    handleFirstnameChange,
    handleLastnameChange,
    handleMissingField,
    handleUsernameChange,
    handlePasswordChange,
    confirmPassword,
    setConfirmPassword,
    handleConfirmPasswordChange,
    confirmPasswordMess,
    setConfirmPasswordMess,
    showPassword,
    setShowPassword,
    username,
    setUsername,
    setEmail,
    setLastname,
    setFirstname,
    email,
    password,
    lastname,
    firstname,
    invalidEmailMess,
    invalidPasswordMess,
    invalidUsernameMess,
    error,
    handleCurrentPasswordChange,
    currentPassword,
    invalidCurrentPassword,
  };
};

export default useValidateInput;
