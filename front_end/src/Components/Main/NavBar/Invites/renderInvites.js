import { Button } from "react-bootstrap";

const renderInvites = (invites, handleAccept, handleDecline) => {
  return Object.values(invites).map((value, index) => {
    const { playername, photo, time } = value;
    return (
      <li key={`invite-${index}`}>
        <div className="image-container">
          <img src={photo}></img>
        </div>
        <div className="name-and-btn-container">
          <p>
            <span>{playername}</span> {`invites you to a game (${time} min)`}
          </p>
          <div className="btn-container">
            <Button
              onClick={handleAccept}
              className="accept-invite"
              playername={playername}
            >
              Accept
            </Button>
            <Button
              onClick={handleDecline}
              className="decline-invite"
              playername={playername}
            >
              Decline
            </Button>
          </div>
        </div>
      </li>
    );
  });
};

export default renderInvites;
