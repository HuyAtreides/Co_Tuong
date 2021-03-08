import React from "react";
import { Col } from "react-bootstrap";
import Timer from "../Timer/Timer.jsx";
import Board from "../Board/Board";
import "./GamePlayArea.scss";
import { useSelector } from "react-redux";
import GameResult from "./GameResult/GameResult.jsx";
import Pause from "./Pause/Pause.jsx";

const GamePlayArea = (props) => {
  const opponentTimeLeftToMove = useSelector(
    (state) => state.gameState.opponentTimeLeftToMove
  );
  const playerTimeLeftToMove = useSelector(
    (state) => state.gameState.playerTimeLeftToMove
  );
  const turnToMove = useSelector((state) => state.boardState.turnToMove);
  const gameResult = useSelector((state) => state.gameState.gameResult);
  const foundMatch = useSelector((state) => state.gameState.foundMatch);
  const capturedPieces = useSelector(
    (state) => state.boardState.capturedPieces
  );

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
        <div className="captured-pieces">
          {capturedPieces.map((element) => {
            if (element.side === element.choosenSide[1])
              return (
                <img
                  src={`/images/Pieces/${element.name}.png`}
                  style={{ width: "27px" }}
                  key={`c${element.position[0]}${element.position[1]}`}
                ></img>
              );
            return null;
          })}
        </div>
        <Timer
          timeLeftToMove={opponentTimeLeftToMove}
          turnToMove={foundMatch && !gameResult ? !turnToMove : turnToMove}
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
        <div className="captured-pieces">
          {capturedPieces.map((element, index) => {
            if (element.side === element.choosenSide[0])
              return (
                <img
                  src={`/images/Pieces/${element.name}.png`}
                  style={{ width: "27px" }}
                  key={`c${index}`}
                ></img>
              );
            return null;
          })}
        </div>
        <Timer timeLeftToMove={playerTimeLeftToMove} turnToMove={turnToMove} />
      </div>
      <GameResult />
      <Pause />
    </Col>
  );
};

export default GamePlayArea;
