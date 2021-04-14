import React, { useState } from "react";
import { Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import "./ProfileHeader.scss";
import { Link } from "react-router-dom";
import callAPI from "../../App/callAPI.js";
import { useDispatch } from "react-redux";

const ProfileHeader = (props) => {
  const { playerInfo, setError, viewOthersProfile, setting } = props;
  const [waitForResponse, setWaitForResponse] = useState(false);
  const dispatch = useDispatch();
  const firstname = playerInfo.name.firstname;
  const lastname = playerInfo.name.lastname;
  const playerFullName = firstname + " " + lastname;

  const handleChangeProfilePic = () => {
    const inputElement = document.querySelector("#pic-input");
    inputElement.click();
  };

  const upload = async (event) => {
    try {
      const formData = new FormData();
      const file = event.currentTarget.files[0];
      const name = event.currentTarget.name;
      formData.append(name, file);
      setWaitForResponse(true);
      const { user, message } = await callAPI(
        "POST",
        `uploads/${playerInfo._id}`,
        formData,
        true
      );
      setWaitForResponse(false);
      if (user) {
        dispatch({ type: "setPlayerInfo", value: user });
      } else if (message) {
        setError(message);
      }
    } catch (err) {
      setError("Looks like there was an error. Please refresh.");
    }
  };

  return (
    <div className="profile-header">
      <div className={`change-pic-area ${setting ? "setting-img" : ""}`}>
        {!waitForResponse && !viewOthersProfile ? (
          <button className="change-pic" onClick={handleChangeProfilePic}>
            <i className="fas fa-camera"></i>Change
          </button>
        ) : null}
        <input
          type="file"
          accept="image/*"
          id="pic-input"
          onChange={upload}
          name={playerInfo._id}
        />
        {!waitForResponse ? (
          <img src={playerInfo.photo} />
        ) : (
          <Spinner animation="border" variant="secondary" />
        )}
      </div>
      <div
        id={viewOthersProfile ? "other-profile" : ""}
        className={`user-profile-info ${setting ? "setting-profile-info" : ""}`}
      >
        <div className="user-name-lastname">
          <OverlayTrigger
            placement="top"
            overlay={(props) => (
              <Tooltip id="profile-name-tooltip" {...props}>
                {playerInfo.username}
              </Tooltip>
            )}
          >
            <p className="user-name">{playerInfo.username}</p>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={(props) => (
              <Tooltip id="profile-name-tooltip" {...props}>
                {playerFullName}
              </Tooltip>
            )}
          >
            <p className="user-full-name">{playerFullName}</p>
          </OverlayTrigger>
        </div>
        <div className="edit-profile-container">
          {!viewOthersProfile && !setting ? (
            <Link to="/settings">
              <i className="fas fa-edit"></i> Edit
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
