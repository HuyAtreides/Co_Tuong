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
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const opponentInfo = useSelector((state) => state.gameState.opponentInfo);

  return (
    <Col
      md={{ span: 4 }}
      sm={{ span: 11 }}
      xs={{ span: 11 }}
      className="board-container pb-3"
    >
      <div className="player-area">
        <div className="avatar-and-name">
          <img src={opponentInfo.photo} alt="" />
          <p className="user-name">{opponentInfo.playername}</p>
        </div>
        <div className="captured-pieces">
          {capturedPieces.map((element, index) => {
            if (element.side === element.choosenSide[1])
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
        <Timer
          timeLeftToMove={opponentTimeLeftToMove}
          turnToMove={foundMatch && !gameResult ? !turnToMove : turnToMove}
        />
      </div>
      <Board />
      <div className="player-area">
        <div className="avatar-and-name">
          <div className="avatar-and-name">
            <img src={playerInfo.photo} alt="" />
            <p className="user-name">{playerInfo.username}</p>
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
