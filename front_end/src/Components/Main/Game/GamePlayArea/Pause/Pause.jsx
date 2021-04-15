import React, { useContext, useEffect } from "react";
import "./Pause.scss";
import { useSelector, useDispatch, useStore } from "react-redux";
import { SocketContext, SetMoveTimerContext } from "../../../../App/context.js";

const Timer = ({ lang, pause }) => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const setMoveTimer = useContext(SetMoveTimerContext);
  const time = useSelector((state) => state.gameState.pauseTime);
  const minute = Math.floor(time / 60);
  const second = time % 60;
  const store = useStore();
  useEffect(() => {
    if (time === 0) {
      if (/Paused/.test(pause)) {
        dispatch({ type: "setPauseTime", value: "timeout" });
        dispatch({ type: "setPause", value: "Timeout" });
        socket.emit("startTimer", true);
      } else {
        socket.emit("startGame");
      }
    }

    socket.on("receiveGameStartSignal", () => {
      socket.emit("receiveGameStartSignalAck");
    });

    socket.on("gameStarted", () => {
      const turnToMove = store.getState().boardState.turnToMove;
      dispatch({ type: "setPauseTime", value: "restart" });
      dispatch({ type: "setPause", value: null });
      socket.emit("startTimer", false);
      dispatch({ type: "setPause", value: null });
      dispatch({ type: "setPauseTime", value: "restart" });
      setMoveTimer(turnToMove, false, dispatch);
    });

    return () => {
      socket.removeAllListeners("receiveGameStartSignal");
      socket.removeAllListeners("gameStarted");
    };
  }, [time]);

  return (
    <p className="pause-timer">
      {/Paused/.test(pause)
        ? lang === "English"
          ? "Resume In"
          : "Tiếp Tục Trong"
        : lang === "English"
        ? "Game Will Start In"
        : "Bắt Đầu Trận Trong"}
      :{" "}
      <span>
        {(minute < 10 ? "0" + minute : minute) +
          ":" +
          (second < 10 ? "0" + second : second)}
      </span>
    </p>
  );
};

const Pause = () => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.appState.lang);
  const pause = useSelector((state) => state.gameState.pause);
  const [boardWidth, boardHeight] = useSelector(
    (state) => state.boardState.boardSize
  );
  const store = useStore();
  const socket = useContext(SocketContext);
  let pauseAnnounce = pause;

  useEffect(() => {
    if (/Resumed/.test(pause))
      dispatch({ type: "setPauseTime", value: "timeout" });

    const handleOpponentPauseOrResumeGame = (pause) => {
      const opponentInfo = store.getState().gameState.opponentInfo;
      const action = pause ? "Paused" : "Resumed";
      const actionInVi = pause ? "Dừng" : "Tiếp Tục";
      const message = {
        from: `${opponentInfo.playername}`,
        message: lang === "English" ? `${action} Game` : `${actionInVi} Trận`,
        className: "game-message",
      };
      dispatch({ type: "setMessage", value: message });
      dispatch({
        type: "setPause",
        value: `${opponentInfo.playername} ${
          pause ? "Paused" : "Resumed"
        } Game`,
      });
      socket.emit(`receive${pause ? "Pause" : "Resume"}SignalAck`);
    };

    socket.on("startPauseTimer", () => {
      socket.removeAllListeners("oneSecondPass");
      socket.on("oneSecondPass", () => {
        dispatch({ type: "setPauseTime", value: null });
      });
      socket.emit("startTimer", true);
    });

    socket.on("opponentPauseGame", () => {
      handleOpponentPauseOrResumeGame(true);
    });

    socket.on("opponentResumeGame", () => {
      handleOpponentPauseOrResumeGame(false);
    });

    return () => {
      socket.removeAllListeners("opponentPauseGame");
      socket.removeAllListeners("opponentResumeGame");
      socket.removeAllListeners("startPauseTimer");
    };
  }, [pause]);

  if (!pause) return null;

  if (lang !== "English") {
    const name = pause.split(" ")[0];
    if (/Paused/.test(pause)) pauseAnnounce = name + " Dừng Trận";
    else if (/Resumed/.test(pause)) pauseAnnounce = name + " Tiếp Tục Trận";
    else pauseAnnounce = "Hết Thời Gian Dừng";
  }

  return (
    <div
      className="pause"
      style={{
        width: `${boardWidth}px`,
        height: `${boardHeight}px`,
      }}
    >
      <div>
        <p className="pause-announce">{pauseAnnounce}</p>
        <Timer pause={pause} lang={lang} />
      </div>
    </div>
  );
};

export default React.memo(Pause);
