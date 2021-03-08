import React, { useContext, useEffect } from "react";
import "./Pause.scss";
import { useSelector, useDispatch } from "react-redux";
import { SocketContext, TimerContext } from "../../../../App/App.jsx";

const Timer = () => {
  const dispatch = useDispatch();
  const time = useSelector((state) => state.gameState.pauseTime);
  const minute = Math.floor(time / 60);
  const second = time % 60;
  return (
    <p className="pause-timer">
      Resume In:{" "}
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
  const timer = useContext(TimerContext);

  useEffect(() => {
    if (pause) {
      timer.postMessage(true);
      timer.onmessage = () => {
        dispatch({ type: "setPauseTime", value: null });
      };
    }
    socket.on("gamePaused", () => {
      console.log("received event");
      dispatch({ type: "setPause", value: "Opponent Paused Game" });
    });

    return () => {
      socket.removeAllListeners("gamePaused");
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
        <Timer />
      </div>
    </div>
  );
};

export default Pause;
