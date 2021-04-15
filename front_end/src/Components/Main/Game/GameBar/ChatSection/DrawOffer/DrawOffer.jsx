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
  const lang = useSelector((state) => state.appState.lang);
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
        reason: lang === "English" ? "Game Draw By Agreement" : "Chấp Nhận Hòa",
        className: "game-message",
      },
    });
    setMoveTimer(null, true, dispatch);
  };

  const handleAcceptOffer = () => {
    dispatch({ type: "setReceiveDrawOffer", value: false });
    if (!gameResult) {
      handleDrawResult();
      socket.emit("gameFinish", "Draw");
    }
  };

  const handleDeclineOffer = () => {
    const mess = lang === "English" ? "Declined A Draw" : "Từ Chối Hòa";
    dispatch({ type: "setReceiveDrawOffer", value: false });
    dispatch({
      type: "setMessage",
      value: {
        from: `${playerInfo.username}`,
        message: mess,
        className: "game-message",
      },
    });
    socket.emit("sendMessage", {
      from: `${playerInfo.username}`,
      message: mess,
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
        <span>{opponentInfo.playername}</span>{" "}
        {lang === "English" ? "Offer A Draw" : "Đề Nghị Hòa"}
      </p>
      <div className="answer">
        <Button className="accept-offer" onClick={handleAcceptOffer}>
          {lang === "English" ? "Accept" : "Đồng Ý"}{" "}
          <i className="fas fa-check"></i>
        </Button>
        <Button className="decline-offer" onClick={handleDeclineOffer}>
          {lang === "English" ? "Decline" : "Từ Chối"}{" "}
          <i className="fas fa-times"></i>
        </Button>
      </div>
    </li>
  );
};

export default DrawOffer;
