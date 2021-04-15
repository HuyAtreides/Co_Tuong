import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";

const renderInvites = (invites, handleAccept, handleDecline, lang) => {
  return invites.map((value, index) => {
    const { playername, photo, time, cancelInvite } = value;
    return (
      <li key={`invite-${index}`}>
        <div className="image-container">
          <img src={photo}></img>
        </div>
        <div className="name-and-btn-container">
          <p>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip id="sender-name-tooltip">{playername}</Tooltip>}
            >
              <span id="player-name">{playername}</span>
            </OverlayTrigger>

            <span id={cancelInvite ? "cancel-invite" : "invite-text"}>
              {cancelInvite
                ? lang === "English"
                  ? " canceled invite"
                  : " hủy lời mời"
                : lang === "English"
                ? ` invites you to a game (${time} min)`
                : ` mời bạn vào trận (${time} phút)`}
            </span>
          </p>
          <div className="btn-container">
            <Button
              onClick={handleAccept}
              className="accept-invite"
              playername={playername}
              disabled={cancelInvite}
            >
              {lang === "English" ? "Accept" : "Đồng Ý"}
            </Button>
            <Button
              onClick={handleDecline}
              className="decline-invite"
              playername={playername}
              disabled={cancelInvite}
            >
              {lang === "English" ? "Decline" : "Từ Chối"}
            </Button>
          </div>
        </div>
      </li>
    );
  });
};

export default renderInvites;
