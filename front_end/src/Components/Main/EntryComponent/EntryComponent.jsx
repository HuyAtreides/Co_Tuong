import React from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import board_image from "./board-image.png";
import "./EntryComponent.scss";

const EntryComponent = (props) => {
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
        <h1>Play Xiangqi Online for Free</h1>
        <Link className="play-button" to="/login">
          Play
        </Link>
      </Col>
    </Row>
  );
};

export default EntryComponent;
