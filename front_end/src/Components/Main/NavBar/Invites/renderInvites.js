import { Button } from "react-bootstrap";

const renderInvites = (invites, handleAccept, handleDecline) => {
  return Object.values(invites).map((value, index) => {
    const { playername, photo } = value;
    return (
      <li key={`invite-${index}`}>
        <div className="image-container">
          <img src={photo}></img>
        </div>
        <div className="name-and-btn-container">
          <p>
            <span>{playername}</span> invites you to a game
          </p>
        </div>
      </li>
    );
  });
};

export default renderInvites;
