import React, { useEffect } from "react";
import "./Timer.scss";
import { useSelector, useDispatch } from "react-redux";

const OpponentTimer = () => {
  const dispatch = useDispatch();
  const timeLeftToMove = useSelector(
    (state) => state.gameState.opponentTimeLeftToMove
  );
  const gameResult = useSelector((state) => state.gameState.gameResult);
  const foundMatch = useSelector((state) => state.gameState.foundMatch);
  const turnToMove = useSelector((state) => state.boardState.turnToMove);
  const minute = Math.floor(timeLeftToMove / 60);
  const second = timeLeftToMove % 60;

  useEffect(() => {
    if (timeLeftToMove === 0) {
      const listItemRef = React.createRef();
      dispatch({ type: "setGameResult", value: "Won" });
      dispatch({
        type: "setSendGameResult",
        value: ["Lose", "Game Abandoned"],
      });
      dispatch({
        type: "setMessage",
        value: {
          type: "game result message",
          winner: "Phan Gia Huy Won - ",
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
        !turnToMove && !gameResult && foundMatch ? "turn-to-move" : ""
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

export default OpponentTimer;
