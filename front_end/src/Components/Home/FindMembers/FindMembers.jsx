import React, { useState } from "react";
import callAPI from "../../App/callAPI.js";
import { useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import renderMembersList from "./renderMembersList.js";
import "./FindMembers.scss";

const FindPlayer = ({ playerInfo }) => {
  const [value, setValue] = useState("");
  const [members, setMembers] = useState([]);
  const [errorMess, setErrorMess] = useState(null);

  const replaceSpecialCharacters = (str) => {
    return str.replace(/[^0-9a-zA-Z-]+/g, "");
  };

  const handleOnChange = async (event) => {
    event.preventDefault();
    try {
      const value = event.currentTarget.value;
      setValue(value);
      if (value) {
        const { players } = await callAPI("POST", "api/players", {
          playername: replaceSpecialCharacters(value),
        });
        const reCheck = document.querySelector("#member-name-input").value;
        if (!players) return;
        const username = playerInfo.username;
        if (reCheck) setMembers(renderMembersList(players, username));
      } else setMembers([]);
    } catch (err) {
      setErrorMess(err.message);
      setTimeout(() => {
        setErrorMess(null);
      }, 1000);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip {...props} id="tooltip">
      {errorMess}
    </Tooltip>
  );

  return (
    <div className="find-players">
      <p className="members-title">Members</p>
      <div className="search-area">
        <OverlayTrigger
          placement="top"
          overlay={renderTooltip}
          show={errorMess !== null}
        >
          <input
            placeholder="Search Members..."
            value={value}
            onChange={handleOnChange}
            id="member-name-input"
          />
        </OverlayTrigger>
        <i className="fas fa-search"></i>
        <ul className="members-list">{members}</ul>
      </div>
    </div>
  );
};

export default FindPlayer;
