import { useEffect } from "react";
import { useDispatch, useStore } from "react-redux";
import { useLocation } from "react-router-dom";

const useHandleRoutingWhilePlaying = (socket, setMoveTimer) => {
  const store = useStore();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const foundMatch = store.getState().gameState.foundMatch;
    const opponentInfo = store.getState().gameState.opponentInfo;
    const result = store.getState().gameState.gameResult;
    if (result === undefined) return;
    if (foundMatch && location.pathname !== "/" && !result) {
      dispatch({ type: "setGameResult", value: "Lose" });
      dispatch({
        type: "setMessage",
        value: {
          type: "game result message",
          winner: `${opponentInfo.playername} Won - `,
          reason: "Game Abandoned",
          className: "game-message",
        },
      });
      setMoveTimer(null, true, dispatch);
      socket.emit("gameFinish", ["Won", "Game Abandoned"]);
    }
  }, [location]);
};

export default useHandleRoutingWhilePlaying;
