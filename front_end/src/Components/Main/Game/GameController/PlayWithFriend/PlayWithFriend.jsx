import React, { useState } from "react";
import "./PlayWithFriend.scss";
import { Button } from "react-bootstrap";

const PlayWithFriend = (props) => {
  const [input, setInput] = useState("");

  const handleOnChange = (event) => {
    const value = event.currentTarget.value;
    setInput(value);
  };

  const handleSubmit = () => {};

  return (
    <div className="play-with-friend-container">
      <i className="fas fa-arrow-left fa-2x" onClick={props.return}></i>
      <div className="btn-container">
        <form className="username-input" onSubmit={handleSubmit}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search..."
            onChange={handleOnChange}
            value={input}
          />
          <Button className="invite" type="submit">
            Invite
          </Button>
        </form>
        <Button className="invite-link">Invite Link</Button>
      </div>
    </div>
  );
};

export default PlayWithFriend;
