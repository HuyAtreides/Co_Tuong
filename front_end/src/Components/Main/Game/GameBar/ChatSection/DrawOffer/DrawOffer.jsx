import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./DrawOffer.scss";
import { Button } from "react-bootstrap";
import {
  SocketContext,
  SetMoveTimerContext,
} from "../../../../../App/context.js";

const DrawOffer = (props) => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const setMoveTimer = useContext(SetMoveTimerContext);
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const opponentInfo = useSelector((state) => state.gameState.opponentInfo);
  const gameResult = useSelector((state) => state.gameState.gameResult);
  const receiveDrawOffer = useSelector(
    (state) => state.gameState.receiveDrawOffer
  );

  const handleDrawResult = () => {
    dispatch({ type: "setGameResult", value: "Draw" });
    dispatch({
      type: "setMessage",
      value: {
        type: "game result message",
        winner: "",
        reason: "Game Draw By Agreement",
        className: "game-message",
      },
    });
    setMoveTimer(null, true, dispatch);
  };

  const handleAcceptOffer = () => {
    if (!gameResult) {
      dispatch({ type: "setReceiveDrawOffer", value: false });
      handleDrawResult();
      socket.emit("gameFinish", "Draw");
    }
  };

  const handleDeclineOffer = () => {
    dispatch({ type: "setReceiveDrawOffer", value: false });
    dispatch({
      type: "setMessage",
      value: {
        from: `${playerInfo.username}`,
        message: "Declined A Draw",
        className: "game-message",
      },
    });
    socket.emit("sendMessage", {
      from: `${playerInfo.username}`,
      message: "Declined A Draw",
      className: "game-message",
    });
  };

  useEffect(() => {
    socket.on("receiveDrawOffer", () => {
      dispatch({ type: "setReceiveDrawOffer", value: true });
    });

    socket.on("draw", () => {
      handleDrawResult();
    });

    return () => {
      socket.removeAllListeners("draw");
      socket.removeAllListeners("receiveDrawOffer");
    };
  });

  if (!receiveDrawOffer) return null;
  return (
    <li className="draw-offer" style={{ display: props.display }}>
      <p>
        <span>{opponentInfo.playername}</span> Offer A Draw
      </p>
      <div className="answer">
        <Button className="accept-offer" onClick={handleAcceptOffer}>
          Accept <i className="fas fa-check"></i>
        </Button>
        <Button className="decline-offer" onClick={handleDeclineOffer}>
          Decline <i className="fas fa-times"></i>
        </Button>
      </div>
    </li>
  );
};

export default DrawOffer;
