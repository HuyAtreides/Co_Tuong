import React, { useState } from "react";
import "./GameResult.scss";
import { useSelector } from "react-redux";

const GameResult = () => {
  const gameResult = useSelector((state) => state.gameState.gameResult);
  const [boardWidth, boardHeight] = useSelector(
    (state) => state.boardState.boardSize
  );
  const [gameResultDisplay, setGameResultDisplay] = useState("flex");

  const handleHideGameResult = () => {
    setGameResultDisplay("none");
  };

  if (!gameResult) return null;
  return (
    <div
      className="game-result"
      style={{
        width: "80%",
        height: `${boardHeight - 40}px`,
        left: `${boardWidth * (10 / 100)}px`,
        display: `${gameResultDisplay}`,
      }}
    >
      <i
        className="fas fa-times hide-game-result"
        onClick={handleHideGameResult}
      ></i>
      <div className="won-side">
        <p>Black Won</p>
      </div>
      <div className="players">
        <div className="player-info">
          <div className="img-container">
            <img
              src="https://betacssjs.chesscomfiles.com/bundles/web/images/black_400.918cdaa6.png"
              alt=""
            />
          </div>

          <p>Opponent</p>
        </div>
        <span>VS</span>
        <div className="player-info">
          <div className="img-container winner">
            <img src="/user_profile_pic/P.svg" alt="" />
          </div>

          <p>Phan Gia Huy</p>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
