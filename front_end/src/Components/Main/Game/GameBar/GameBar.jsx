import React, { useState, useRef, useEffect } from "react";
import { Col, Button } from "react-bootstrap";
import "./GameBar.scss";
import { useSelector, useDispatch } from "react-redux";
import ChatSection from "./ChatSection/ChatSection.jsx";

const GameBar = (props) => {
  const dispatch = useDispatch();
  const handleOfferDraw = () => {};

  return (
    <Col
      md={{ span: 4 }}
      xs={{ span: 10 }}
      className="game-controller mb-3 game-bar-controller"
    >
      <div className="button-container game-bar">
        <div className="select-side-container">
          <Button
            className="red-side draw-btn"
            value="draw"
            onClick={handleOfferDraw}
          >
            &#189; Draw
          </Button>
          <Button className="black-side resign-btn" value="resign">
            <i className="fas fa-flag"></i> Resign
          </Button>
        </div>
        <div className="time-select-container">
          <Button className="select-timer pause-btn">
            <i className="fas fa-pause"></i> Pause
          </Button>
        </div>
      </div>
      <ChatSection />
      <Button className="exit-game" disabled={true}>
        Exit Game
      </Button>
    </Col>
  );
};

export default GameBar;
