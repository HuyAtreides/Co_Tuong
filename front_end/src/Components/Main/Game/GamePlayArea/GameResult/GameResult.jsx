import React from "react";
import "./GameResult.scss";
import { useSelector, useDispatch } from "react-redux";

const GameResult = () => {
  const dispatch = useDispatch();
  const gameResult = useSelector((state) => state.gameState.gameResult);
  const [boardWidth, boardHeight] = useSelector(
    (state) => state.boardState.boardSize
  );
  const gameResultDisplay = useSelector(
    (state) => state.gameState.gameResultDisplay
  );
  const side = useSelector((state) => state.boardState.side);
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const opponentInfo = useSelector((state) => state.gameState.opponentInfo);
  let displayGameResult = "Draw";

  if (gameResult === "Won") {
    displayGameResult = `${
      side[1].charAt(0).toUpperCase() + side[1].slice(1)
    } Won`;
  } else if (gameResult === "Lose")
    displayGameResult = `${
      side[0].charAt(0).toUpperCase() + side[0].slice(1)
    } Won`;

  const handleHideGameResult = () => {
    dispatch({ type: "setGameResultDisplay", value: "none" });
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
        <p>{displayGameResult}</p>
      </div>
      <div className="players">
        <div className="player-info">
          <div
            className={`img-container ${
              gameResult === "Won" || gameResult === "Draw" ? "" : "winner"
            }`}
          >
            <img src={opponentInfo.photo} alt="" />
          </div>

          <p>{opponentInfo.playername}</p>
        </div>
        <span>VS</span>
        <div className="player-info">
          <div
            className={`img-container ${gameResult === "Won" ? "winner" : ""}`}
          >
            <img src={playerInfo.photo} alt="" />
          </div>

          <p>{playerInfo.username}</p>
        </div>
      </div>
    </div>
  );
};

export default GameResult;
