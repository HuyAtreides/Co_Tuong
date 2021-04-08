import React, { useEffect } from "react";
import "./Home.scss";
import { Table, Row, Col, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Home = (props) => {
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const lang = useSelector((state) => state.appState.lang);
  const option = { year: "numeric", month: "long", day: "numeric" };
  const firstname = playerInfo.name.firstname;
  const lastname = playerInfo.name.lastname;
  const playerFullName =
    (!firstname ? "" : firstname) + " " + (!lastname ? "" : lastname);

  const joinDate = new Date(playerInfo.join).toLocaleDateString(
    "us-US",
    option
  );

  const lastOnlineDate = new Date(playerInfo.lastOnline).toLocaleDateString(
    "us-US",
    option
  );

  return (
    <Row className="home-row mt-3">
      <Col
        md={{ span: 8 }}
        sm={{ span: 11 }}
        className="profile-info-container"
      >
        <div className="profile-header">
          <div className="change-pic-area">
            <button className="change-pic">
              <i className="fas fa-camera"></i>Change
            </button>
            <input type="file" accept="image/*" id="pic-input" />
            <img src={playerInfo.photo} id="" />
            {/* <Spinner animation="border" variant="secondary" /> */}
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
              {playerInfo.matches.length > 1000000
                ? "1000000+"
                : playerInfo.matches.length}
            </p>
          </div>
        </div>
        <div className="match-history-container">
          <div className="match-history-title">
            <p>Matches History</p>
            <p>0W / 0L/ 0D</p>
          </div>
          <Table borderless responsive={true}>
            <thead>
              <tr>
                <th></th>
                <th>Players</th>
                <th>Result</th>
                <th className="date-head">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="game-table-row">
                <td className="game-time">
                  <div className="match-history-value">
                    {" "}
                    <i
                      className="fas fa-clock"
                      style={{ color: "#769656" }}
                    ></i>
                    10 min
                  </div>
                </td>
                <td className="players-name">
                  <div className="match-history-value">
                    <p>
                      <i className="fas fa-plus-square"></i>Phan Gia Huy
                    </p>
                    <p>
                      <i className="fas fa-minus-square"></i>Nguyen Hoang Thien
                      Truong An
                    </p>
                  </div>
                </td>
                <td className="match-result">
                  <div className="match-history-value">Won</div>
                </td>
                <td className="match-date">
                  <div>{joinDate}</div>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Col>
      <Col
        md={{ span: 3 }}
        sm={{ span: 11 }}
        className="find-players-container"
      >
        <div className="find-players">Col-2</div>
      </Col>
    </Row>
  );
};

export default Home;
