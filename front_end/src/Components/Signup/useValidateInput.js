import { useState } from "react";

const useValidateInput = () => {
  const [invalidUsernameMess, setInvalidUsernameMess] = useState("");
  const [invalidEmailMess, setInvalidEmailMess] = useState("");
  const [invalidPasswordMess, setInvalidPasswordMess] = useState("");
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

  return {
    handleEmailChange,
    handleError,
    setError,
    handleFirstnameChange,
    handleLastnameChange,
    handleMissingField,
    handleUsernameChange,
    handlePasswordChange,
    username,
    email,
    password,
    lastname,
    firstname,
    invalidEmailMess,
    invalidFirstname,
    invalidLastname,
    invalidPasswordMess,
    invalidUsernameMess,
    error,
  };
};

export default useValidateInput;
