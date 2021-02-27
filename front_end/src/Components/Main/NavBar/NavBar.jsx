import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavBar.scss";

const NavBar = (props) => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.gameState.lang);

  const handleSetLang = (event) => {
    const selectedLang = event.currentTarget.text;
    dispatch({ type: "setLang", value: selectedLang });
  };

  return (
    <Navbar expand="md" className="nav-bar">
      <Navbar.Brand>
        <Link to="/" className="link-brand">
          Xiangqi
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="nav">
          <Link to="/login" className="link nav-link">
            Sign In
          </Link>
          <Link to="/signup" className="link nav-link">
            Sign Up
          </Link>
          <NavDropdown title={lang} id="basic-nav-dropdown">
            <NavDropdown.Item onClick={handleSetLang}>
              Tiếng Việt
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleSetLang}>English</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
