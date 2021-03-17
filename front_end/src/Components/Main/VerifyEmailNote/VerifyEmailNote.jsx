import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./VerifyEmailNote.scss";

const VerifyEmailNote = () => {
  const [hideNote, setHideNote] = useState(false);

  const handleHideNote = () => {
    setHideNote(true);
  };

  return (
    <div
      className="verify-email-note"
      style={{ display: hideNote ? "none" : "block" }}
    >
      <p>
        Look Like you haven't verified your email. Please click{" "}
        <Link to="/verify-email">here</Link> to verify your email.
      </p>
      <i className="fas fa-times hide-note" onClick={handleHideNote}></i>
    </div>
  );
};

export default VerifyEmailNote;
