import React from "react";
import { useSelector, useDispatch } from "react-redux";
import "./DrawOffer.scss";
import { Button } from "react-bootstrap";

const DrawOffer = (props) => {
  const dispatch = useDispatch();
  const receiveDrawOffer = useSelector(
    (state) => state.gameState.receiveDrawOffer
  );
  const handleAcceptOffer = () => {
    const listItemRef = React.createRef();
    dispatch({ type: "setReceiveDrawOffer", value: false });
    dispatch({ type: "setGameResult", value: "Draw" });
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
  };

  const handleDeclineOffer = () => {
    const listItemRef = React.createRef();
    dispatch({ type: "setReceiveDrawOffer", value: false });
    dispatch({
      type: "setMessage",
      value: {
        from: "You",
        message: "Decline A Draw",
        className: "game-message",
        ref: listItemRef,
      },
    });
    dispatch({
      type: "setMessageToSend",
      value: {
        from: "Opponent",
        message: "Decline A Draw",
        className: "game-message",
        ref: listItemRef,
      },
    });
  };

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
