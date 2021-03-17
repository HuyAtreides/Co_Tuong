import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, NavDropdown, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import callAPI from "../../App/callAPI.js";
import "./NavBar.scss";

const NavBar = (props) => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.appState.lang);
  const handleSetLang = (event) => {
    const selectedLang = event.currentTarget.text;
    dispatch({ type: "setLang", value: selectedLang });
  };

  const handleLogout = async () => {
    props.setWaitForResponse(true);
    await callAPI("GET", "/logout", null);
    dispatch({ type: "setIsAuthenticated", value: false });
    dispatch({ type: "setPlayerInfo", value: null });
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
          <button className="link nav-link logout" onClick={handleLogout}>
            Log out
          </button>
          <Link to="/signup" className="link nav-link ">
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
