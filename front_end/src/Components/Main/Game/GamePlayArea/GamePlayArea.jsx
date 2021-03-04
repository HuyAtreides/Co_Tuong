import React from "react";
import { Col } from "react-bootstrap";
import Timer from "../Timer/Timer.jsx";
import Board from "../Board/Board";
import "./GamePlayArea.scss";
import { useSelector } from "react-redux";

const GamePlayArea = (props) => {
  const opponentTimeLeftToMove = useSelector(
    (state) => state.gameState.opponentTimeLeftToMove
  );
  const playerTimeLeftToMove = useSelector(
    (state) => state.gameState.playerTimeLeftToMove
  );
  const turnToMove = useSelector((state) => state.boardState.turnToMove);
  const foundMatch = useSelector((state) => state.gameState.foundMatch);

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
        <Timer
          timeLeftToMove={opponentTimeLeftToMove}
          turnToMove={foundMatch ? !turnToMove : turnToMove}
        />
      </div>
      <Board setTimer={props.setTimer} />
      <div className="player-area">
        <div className="avatar-and-name">
          <div className="avatar-and-name">
            <img src="/user_profile_pic/P.svg" alt="" />
            <p className="user-name">Phan Gia Huy</p>
          </div>
        </div>
        <Timer timeLeftToMove={playerTimeLeftToMove} turnToMove={turnToMove} />
      </div>
    </Col>
  );
};

export default GamePlayArea;
