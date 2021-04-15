import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./VerifyEmailNote.scss";

const VerifyEmailNote = (lang) => {
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
        {lang === "English" ? (
          <>
            Look Like you haven't verified your email. Please click{" "}
            <Link to="/verify-email">here</Link> to verify your email or{" "}
            <Link to="/settings">here</Link> to change your email.
          </>
        ) : (
          <>
            Bạn chưa xác nhận email. xin hãy nhấp vào{" "}
            <Link to="/verify-email">đây</Link> để xác nhận email hoặc vào{" "}
            <Link to="/settings">đây</Link> để thay đổi email.
          </>
        )}
      </p>
      <i className="fas fa-times hide-note" onClick={handleHideNote}></i>
    </div>
  );
};

export default VerifyEmailNote;
