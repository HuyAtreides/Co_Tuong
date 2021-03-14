import React, { useContext, useEffect } from "react";
import "./Pause.scss";
import { useSelector, useDispatch } from "react-redux";
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
        socket.emit("startTimer", true);
        dispatch({ type: "setPauseTime", value: "timeout" });
        dispatch({ type: "setPause", value: "Timeout" });
      } else {
        socket.emit("startTimer", false);
        dispatch({ type: "setPauseTime", value: "restart" });
        dispatch({ type: "setPause", value: null });
        setMoveTimer(turnToMove, false, dispatch);
        socket.emit("resumeGame");
      }
    }

    socket.on("pauseOver", () => {
      const listItemRef = React.createRef();
      dispatch({ type: "setPause", value: "Timeout" });
      dispatch({ type: "setPauseTime", value: "timeout" });
      socket.emit("starTimer", true);
      dispatch({
        type: "setMessage",
        value: {
          from: "",
          message: "Pause Timeout",
          className: "game-message",
          ref: listItemRef,
        },
      });
    });

    socket.on("gameResumed", () => {
      socket.emit("startTimer", false);
      dispatch({ type: "setPause", value: null });
      dispatch({ type: "setPauseTime", value: "restart" });
      setMoveTimer(turnToMove, false, dispatch);
    });

    return () => {
      socket.removeAllListeners("pauseOver");
      socket.removeAllListeners("gameResumed");
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
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (pause) {
      if (/Paused/.test(pause)) {
        socket.removeAllListeners("oneSecondPass");
        socket.emit("startTimer", true);
        socket.on("oneSecondPass", () => {
          dispatch({ type: "setPauseTime", value: null });
        });
      } else if (/Resumed/.test(pause)) {
        socket.emit("startTimer", true);
        dispatch({ type: "setPauseTime", value: "timeout" });
      }
    }

    socket.on("gamePaused", () => {
      const listItemRef = React.createRef();
      const message = {
        from: "Opponent",
        message: "Paused Game",
        className: "game-message",
        ref: listItemRef,
      };
      dispatch({ type: "setMessage", value: message });
      dispatch({ type: "setPause", value: "Opponent Paused Game" });
    });

    socket.on("opponentResumeGame", () => {
      const listItemRef = React.createRef();
      const message = {
        from: "Opponent",
        message: "Resumed Game",
        className: "game-message",
        ref: listItemRef,
      };
      dispatch({ type: "setMessage", value: message });
      dispatch({ type: "setPause", value: "Opponent Resumed Game" });
    });

    return () => {
      socket.removeAllListeners("gamePaused");
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

export default Pause;
