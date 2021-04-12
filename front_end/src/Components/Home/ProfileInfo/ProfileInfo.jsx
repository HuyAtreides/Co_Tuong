import React from "react";
import { useSelector } from "react-redux";
import "./ProfileInfo.scss";

const ProfileInfo = ({ playerInfo }) => {
  const option = { year: "numeric", month: "long", day: "numeric" };
  const lang = useSelector((state) => state.appState.lang);
  const { won, draw, lost } = playerInfo.totalGames;
  const totalMatches = won + draw + lost;
  const joinDate = new Date(playerInfo.join).toLocaleDateString(
    "us-US",
    option
  );
  const lastOnlineDate = new Date(playerInfo.lastOnline).toLocaleDateString(
    "us-US",
    option
  );

  return (
    <div className="profile-info">
      <div className="join profile-info-item">
        <i className="fas fa-user-plus " style={{ marginLeft: "9px" }}></i>
        <p className="item-title">Joined</p>
        <p className="item-value">{joinDate}</p>
      </div>
      <div className="last-online profile-info-item">
        <i className="fas fa-signal "></i>
        <p className="item-title">Last Online</p>

        <p className="item-value">{lastOnlineDate}</p>
      </div>
      <div className="games profile-info-item">
        <i className="fas fa-chess-board "></i>
        <p className="item-title">Games</p>
        <p className="item-value">
          {totalMatches > 1000000 ? "1000000+" : totalMatches}
        </p>
      </div>
    </div>
  );
};

export default ProfileInfo;
