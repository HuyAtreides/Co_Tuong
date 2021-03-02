import React from "react";
import { Col } from "react-bootstrap";
import Timer from "../Timer/Timer.jsx";
import Board from "../Board/Board";
import "./GamePlayArea.scss";

const GamePlayArea = (props) => {
  return (
    <Col
      md={{ span: 4 }}
      sm={{ span: 11 }}
      xs={{ span: 11 }}
      className="board-container pb-3"
    >
      <div className="player-area">
        <div className="avatar-and-name">
          <img
            src="https://betacssjs.chesscomfiles.com/bundles/web/images/black_400.918cdaa6.png"
            alt=""
          />
          <p className="user-name">Opponent</p>
        </div>
        <Timer timeLeftToMove={props.timeLeftToMove} />
      </div>
      <Board />
      <div className="player-area">
        <div className="avatar-and-name">
          <div className="avatar-and-name">
            <img src="/user_profile_pic/P.svg" alt="" />
            <p className="user-name">Phan Gia Huy</p>
          </div>
        </div>
        <Timer timeLeftToMove={props.timeLeftToMove} />
      </div>
    </Col>
  );
};

export default GamePlayArea;
