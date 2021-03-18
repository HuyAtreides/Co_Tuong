import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, NavDropdown, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import callAPI from "../../App/callAPI.js";
import { SocketContext } from "../../App/context.js";
import "./NavBar.scss";

const NavBar = (props) => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const lang = useSelector((state) => state.appState.lang);
  const handleSetLang = (event) => {
    const selectedLang = event.currentTarget.text;
    dispatch({ type: "setLang", value: selectedLang });
  };
  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );

  const handleLogout = async (manualLogout = true) => {
    props.setWaitForResponse(true);
    await callAPI("GET", "/logout", null);
    if (manualLogout) socket.emit("logout");
    dispatch({ type: "setIsAuthenticated", value: false });
    dispatch({ type: "setPlayerInfo", value: null });
    socket.disconnect();
  };

  useEffect(() => {
    socket.on("accountLogout", () => {
      handleLogout(false);
    });

    return () => {
      socket.removeAllListeners("accountLogout");
    };
  }, []);

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
          <Link
            to={`/${!isAuthenticated ? "login" : "home"}`}
            className="link nav-link"
          >
            {isAuthenticated ? "Home" : "Sign In"}
          </Link>
          <button
            className="link nav-link logout"
            onClick={handleLogout}
            style={{ display: isAuthenticated ? "inline" : "none" }}
          >
            Log Out
          </button>
          <Link
            to="/signup"
            className="link nav-link "
            style={{ display: !isAuthenticated ? "inline" : "none" }}
          >
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
