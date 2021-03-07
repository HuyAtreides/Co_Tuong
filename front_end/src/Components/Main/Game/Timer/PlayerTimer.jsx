import React, { useEffect } from "react";
import "./Timer.scss";
import { useSelector, useDispatch } from "react-redux";

const PlayerTimer = () => {
  const dispatch = useDispatch();
  const timeLeftToMove = useSelector(
    (state) => state.gameState.playerTimeLeftToMove
  );
  const turnToMove = useSelector((state) => state.boardState.turnToMove);
  const gameResult = useSelector((state) => state.gameState.gameResult);
  const foundMatch = useSelector((state) => state.gameState.foundMatch);
  const minute = Math.floor(timeLeftToMove / 60);
  const second = timeLeftToMove % 60;

  useEffect(() => {
    if (timeLeftToMove === 0) {
      const listItemRef = React.createRef();
      dispatch({ type: "setGameResult", value: "Lose" });
      dispatch({ type: "setSendGameResult", value: ["Won", "Game Abandoned"] });
      dispatch({
        type: "setMessage",
        value: {
          type: "game result message",
          winner: "Opponent Won - ",
          reason: "Game Abandoned",
          className: "game-message",
          ref: listItemRef,
        },
      });
    }
  }, [timeLeftToMove]);

  return (
    <div
      className={`clock ${
        turnToMove && !gameResult && foundMatch ? "turn-to-move" : ""
      }`}
    >
      <span>
        {(minute < 10 ? "0" + minute : minute) +
          ":" +
          (second < 10 ? "0" + second : second)}
      </span>
    </div>
  );
};

export default PlayerTimer;
