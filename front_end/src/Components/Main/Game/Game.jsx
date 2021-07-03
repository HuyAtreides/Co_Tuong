import React, { useState, useContext, useEffect } from "react";
import { SocketContext, SetMoveTimerContext } from "../../App/context.js";
import "./Game.scss";
import { Row } from "react-bootstrap";
import GameController from "./GameController/GameController.jsx";
import GamePlayArea from "./GamePlayArea/GamePlayArea.jsx";
import { useSelector, useStore, useDispatch } from "react-redux";
import GameBar from "./GameBar/GameBar.jsx";

const Game = () => {
  const dispatch = useDispatch();
  const [timeSelectorDisplay, setTimeSelectorDisplay] = useState("none");
  const foundMatch = useSelector((state) => state.gameState.foundMatch);
  const [centerBoard, setCenterBoard] = useState(false);
  const socket = useContext(SocketContext);
  const lang = useSelector((state) => state.appState.lang);
  const store = useStore();
  const setMoveTimer = useContext(SetMoveTimerContext);

  const handleCenterBoard = () => {
    setCenterBoard(!centerBoard);
  };

  const handleToggle = () => {
    setTimeSelectorDisplay(timeSelectorDisplay === "none" ? "flex" : "none");
  };

  const handleGameOver = (result, reason) => {
    const opponentInfo = store.getState().gameState.opponentInfo;
    const playerInfo = store.getState().appState.playerInfo;
    dispatch({ type: "setGameResult", value: result });
    dispatch({ type: "setReceiveDrawOffer", value: false });
    dispatch({
      type: "setMessage",
      value: {
        type: "game result message",
        winner: `${
          result === "Won"
            ? `${playerInfo.username}`
            : `${opponentInfo.playername}`
        } ${lang === "English" ? "Won" : "Thắng"} - `,
        reason:
          lang === "English"
            ? reason
            : reason === "Game Abandoned"
            ? "Trận Đấu Bị Hủy"
            : /Resigned/.test(reason)
            ? reason.replace("Resigned", "Đầu Hàng")
            : "Chiếu Bí",
        className: "game-message",
      },
    });
    setMoveTimer(null, true, dispatch);
  };

  const handleResign = () => {
    const playerInfo = store.getState().appState.playerInfo;
    handleGameOver("Lose", `${playerInfo.username} Resigned`);
    socket.emit("gameFinish", ["Won", `${playerInfo.username} Resigned`]);
  };

  useEffect(() => {
    socket.on("gameOver", (result, reason) => {
      const foundMatch = store.getState().gameState.foundMatch;
      const gameResult = store.getState().gameState.gameResult;
      if (gameResult !== null || !foundMatch) return;
      handleGameOver(result, reason);
    });

    socket.on("opponentLeftGame", () => {
      const foundMatch = store.getState().gameState.foundMatch;
      const opponentInfo = store.getState().gameState.opponentInfo;
      if (foundMatch)
        dispatch({
          type: "setMessage",
          value: {
            from: `${opponentInfo.playername}`,
            message: lang === "English" ? "Left The Game" : "Đã Rời Trận",
            className: "game-message",
          },
        });
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !socket.connected) {
        socket.open();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      socket.removeAllListeners("opponentLeftGame");
      socket.removeAllListeners("gameOver");
      document.removeAllListeners("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <Row md={{ cols: 1 }} className="mt-3 pb-3">
      <GamePlayArea lang={lang} />
      <div
        className="w-100"
        style={{ display: centerBoard ? "block" : "none" }}
      ></div>
      {!foundMatch ? (
        <GameController
          timeSelectorDisplay={timeSelectorDisplay}
          handleToggle={handleToggle}
          handleCenterBoard={handleCenterBoard}
          centerBoard={centerBoard}
        />
      ) : (
        <GameBar
          handleCenterBoard={handleCenterBoard}
          centerBoard={centerBoard}
          handleResign={handleResign}
        />
      )}
    </Row>
  );
};

export default Game;
