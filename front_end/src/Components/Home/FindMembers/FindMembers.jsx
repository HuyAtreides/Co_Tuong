import React, { useState } from "react";
import "./FindMembers.scss";

const FindPlayer = (props) => {
  const [value, setValue] = useState("");

  const handleOnChange = (event) => {
    event.preventDefault();
    const value = event.currentTarget.value;
    setValue(value);
  };

  return (
    <div className="find-players">
      <p className="members-title">Members</p>
      <div className="search-area">
        <input
          placeholder="Search Members..."
          value={value}
          onChange={handleOnChange}
        />
        <i className="fas fa-search"></i>
        <ul className="members-list">
          {/* <li className="member">
            <Link className="member-profile-link" to="/home" target="_blank">
              <div>
                <img src="https://betacssjs.chesscomfiles.com/bundles/web/images/black_400.918cdaa6.png" />
              </div>
              <div className="member-info">
                <div className="name-and-state">
                  <p className="member-name"> Huy</p>
                  <p className="member-state">Online</p>
                </div>
                <div className="join-date-and-name">
                  <p>Phan Gia Huy</p>
                  <p>Join: 10 April, 2021</p>
                </div>
              </div>
            </Link>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default FindPlayer;
