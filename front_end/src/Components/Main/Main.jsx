import React from "react";
import EntryComponent from "./EntryComponent/EntryComponent.jsx";
import NavBar from "./NavBar/NavBar.jsx";
import { Container } from "react-bootstrap";
import "./Main.scss";

const Main = (props) => {
  return (
    <Container fluid>
      <NavBar />
      <EntryComponent />
    </Container>
  );
};

export default Main;
