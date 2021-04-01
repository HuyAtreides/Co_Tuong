import React, { useContext, useEffect } from "react";
import "./Pause.scss";
import { useSelector, useDispatch, useStore } from "react-redux";
import { SocketContext, SetMoveTimerContext } from "../../../../App/context.js";

const Timer = (props) => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const setMoveTimer = useContext(SetMoveTimerContext);
  const time = useSelector((state) => state.gameState.pauseTime);
  const minute = Math.floor(time / 60);
  const second = time % 60;
  const turnToMove = useSelector((state) => state.boardState.turnToMove);
  useEffect(() => {
    if (time === 0) {
      if (/Paused/.test(props.pause)) {
        dispatch({ type: "setPauseTime", value: "timeout" });
        dispatch({ type: "setPause", value: "Timeout" });
        socket.emit("startTimer", true);
      } else {
        socket.emit("startTimer", false);
        dispatch({ type: "setPauseTime", value: "restart" });
        dispatch({ type: "setPause", value: null });
        socket.emit("startGame");
        setMoveTimer(turnToMove, false, dispatch);
      }
    }

    socket.on("pauseOver", () => {
      dispatch({ type: "setPause", value: "Timeout" });
      dispatch({ type: "setPauseTime", value: "timeout" });
      dispatch({
        type: "setMessage",
        value: {
          from: "",
          message: "Pause Timeout",
          className: "game-message",
        },
      });
      socket.emit("starTimer", true);
    });

    socket.on("gameStarted", () => {
      socket.emit("startTimer", false);
      dispatch({ type: "setPause", value: null });
      dispatch({ type: "setPauseTime", value: "restart" });
      setMoveTimer(turnToMove, false, dispatch);
    });

    return () => {
      socket.removeAllListeners("pauseOver");
      socket.removeAllListeners("gameStarted");
    };
  }, [time]);

  return (
    <p className="pause-timer">
      {/Paused/.test(props.pause) ? "Resume In" : "Game Will Start In"}:{" "}
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
  const pause = useSelector((state) => state.gameState.pause);
  const [boardWidth, boardHeight] = useSelector(
    (state) => state.boardState.boardSize
  );
  const store = useStore();
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (pause) {
      if (/Paused/.test(pause)) {
        socket.removeAllListeners("oneSecondPass");
        socket.on("oneSecondPass", () => {
          dispatch({ type: "setPauseTime", value: null });
        });
        socket.emit("startTimer", true);
      } else if (/Resumed/.test(pause)) {
        dispatch({ type: "setPauseTime", value: "timeout" });
        socket.emit("startTimer", true);
      }
    }

    const handleOpponentPauseOrResumeGame = (pause) => {
      const opponentInfo = store.getState().gameState.opponentInfo;
      const message = {
        from: `${opponentInfo.playername}`,
        message: `${pause ? "Paused" : "Resumed"} Game`,
        className: "game-message",
      };
      dispatch({ type: "setMessage", value: message });
      dispatch({
        type: "setPause",
        value: `${opponentInfo.playername} ${
          pause ? "Paused" : "Resumed"
        } Game`,
      });
    };

    socket.on("opponentPauseGame", () => {
      handleOpponentPauseOrResumeGame(true);
    });

    socket.on("opponentResumeGame", () => {
      handleOpponentPauseOrResumeGame(false);
    });

    return () => {
      socket.removeAllListeners("opponentPauseGame");
      socket.removeAllListeners("opponentResumeGame");
    };
  }, [pause]);

  if (!pause) return null;
  return (
    <div
      className="pause"
      style={{
        width: `${boardWidth}px`,
        height: `${boardHeight}px`,
      }}
    >
      <div>
        <p className="pause-announce">{pause}</p>
        <Timer pause={pause} />
      </div>
    </div>
  );
};

export default React.memo(Pause);
