import React, { useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./DrawOffer.scss";
import { Button } from "react-bootstrap";
import {
  SocketContext,
  SetMoveTimerContext,
} from "../../../../../App/context.js";

const DrawOffer = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const setMoveTimer = useContext(SetMoveTimerContext);
  const receiveDrawOffer = useSelector(
    (state) => state.gameState.receiveDrawOffer
  );

  const handleDrawResult = () => {
    const listItemRef = React.createRef();
    dispatch({ type: "setSendGameResult", value: "Draw" });
    dispatch({
      type: "setMessage",
      value: {
        type: "game result message",
        winner: "",
        reason: "Game Draw By Agreement",
        className: "game-message",
        ref: listItemRef,
      },
    });
    setMoveTimer(null, true, dispatch);
  };

  const handleAcceptOffer = () => {
    dispatch({ type: "setReceiveDrawOffer", value: false });
    socket.emit("gameFinish", "Draw");
    handleDrawResult();
  };

  const handleDeclineOffer = () => {
    const listItemRef = React.createRef();
    dispatch({ type: "setReceiveDrawOffer", value: false });
    dispatch({
      type: "setMessage",
      value: {
        from: "You",
        message: "Declined A Draw",
        className: "game-message",
        ref: listItemRef,
      },
    });
    socket.emit("sendMessage", {
      from: "Opponent",
      message: "Declined A Draw",
      className: "game-message",
      ref: listItemRef,
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
    <li className="draw-offer">
      <p>
        <span>Opponent</span> Offer A Draw
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
