import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import "./ProfileHeader.scss";
import { Link } from "react-router-dom";
import callAPI from "../../App/callAPI.js";
import { useDispatch, useSelector } from "react-redux";

const ProfileHeader = (props) => {
  const [waitForResponse, setWaitForResponse] = useState(false);
  const dispatch = useDispatch();
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const firstname = playerInfo.name.firstname;
  const lastname = playerInfo.name.lastname;
  const playerFullName =
    (!firstname ? "" : firstname) + " " + (!lastname ? "" : lastname);

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
        props.setError(message);
      }
    } catch (err) {
      props.setError("Looks like there was an error. Please refresh.");
    }
  };

  return (
    <div className="profile-header">
      <div className="change-pic-area">
        {!waitForResponse ? (
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
      <div className="user-profile-info">
        <div className="user-name-lastname">
          <p className="user-name">{playerInfo.username}</p>
          <p className="user-full-name">{playerFullName}</p>
        </div>
        <div className="edit-profile-container">
          <Link to="">
            <i className="fas fa-edit"></i> Edit
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
