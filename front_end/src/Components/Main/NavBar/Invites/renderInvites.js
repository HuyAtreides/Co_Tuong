import { Button } from "react-bootstrap";

const renderInvites = (invites, handleAccept, handleDecline) => {
  return Object.values(invites).map((value, index) => {
    const { playername, photo, time, cancelInvite } = value;
    return (
      <li key={`invite-${index}`}>
        <div className="image-container">
          <img src={photo}></img>
        </div>
        <div className="name-and-btn-container">
          <p>
            <span id="player-name">{playername}</span>
            <span id={cancelInvite ? "cancel-invite" : "invite-text"}>
              {cancelInvite
                ? " canceled invite"
                : ` invites you to a game (${time} min)`}
            </span>
          </p>
          <div className="btn-container">
            <Button
              onClick={handleAccept}
              className="accept-invite"
              playername={playername}
              disabled={cancelInvite}
            >
              Accept
            </Button>
            <Button
              onClick={handleDecline}
              className="decline-invite"
              playername={playername}
              disabled={cancelInvite}
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
