import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import board_image from "./board-image.png";
import { useSelector } from "react-redux";
import "./EntryComponent.scss";

const EntryComponent = () => {
  const lang = useSelector((state) => state.appState.lang);

  return (
    <Row md={{ cols: 2 }} className="justify-content-around mt-5">
      <Col
        className="image-container"
        md={{ span: 4, order: 1 }}
        xs={{ span: 10, order: 2 }}
      >
        <img src={board_image} alt="" />
      </Col>
      <Col
        className="intro"
        md={{ span: 4, order: 2 }}
        xs={{ span: 10, order: 1 }}
      >
        <h1>
          {lang === "English"
            ? "Play Xiangqi Online for Free"
            : "Chơi Cờ Tướng Miễn Phí"}
        </h1>
        <Link className="play-button" to="/signin">
          {lang === "English" ? "Play" : "Chơi"}
        </Link>
      </Col>
    </Row>
  );
};

export default EntryComponent;
