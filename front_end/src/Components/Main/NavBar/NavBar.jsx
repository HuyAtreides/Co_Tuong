import React, { useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, NavDropdown, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import callAPI from "../../App/callAPI.js";
import Invites from "./Invites/Invites.jsx";
import { SocketContext } from "../../App/context.js";
import "./NavBar.scss";

const NavBar = (props) => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const lang = useSelector((state) => state.appState.lang);
  const playerInfo = useSelector((state) => state.appState.playerInfo);

  const handleSetLang = (event) => {
    const selectedLang = event.currentTarget.text;
    dispatch({ type: "setLang", value: selectedLang });
    if (playerInfo)
      callAPI("POST", "api/setLang", {
        username: playerInfo.username,
        choosenLang: selectedLang,
      });
  };

  useEffect(() => {
    document.querySelector("title").innerText =
      lang === "English" ? "Xiangqi" : "Cờ Tướng";
  }, [lang]);

  const isAuthenticated = useSelector(
    (state) => state.appState.isAuthenticated
  );

  const handleLogout = async () => {
    props.setWaitForResponse(true);
    await callAPI("GET", "api/logout", null);
    dispatch({ type: "setIsAuthenticated", value: false });
    dispatch({ type: "setPlayerInfo", value: null });
    if (props.setRedirect) props.setRedirect(true);
    socket.disconnect();
  };

  return (
    <Navbar expand="md" className="nav-bar">
      <Invites lang={lang} />
      <Navbar.Brand>
        <Link to="/" className="link-brand">
          {lang === "English" ? "Xiangqi" : "Cờ Tướng"}
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="nav">
          {props.setRedirect ? (
            <Link to="/" className="link nav-link">
              {lang === "English" ? "Play" : "Chơi"}
            </Link>
          ) : null}
          <Link
            target={
              isAuthenticated && isAuthenticated !== "guest" ? "_self" : "_self"
            }
            to={`/${
              isAuthenticated && isAuthenticated !== "guest" ? "home" : "signin"
            }`}
            className="link nav-link"
            style={{
              display: props.setRedirect ? "none" : "inline",
            }}
          >
            {isAuthenticated && isAuthenticated !== "guest"
              ? lang === "English"
                ? "Home"
                : "Trang Chủ"
              : lang === "English"
              ? "Sign In"
              : "Đăng Nhập"}
          </Link>
          <button
            className="link nav-link logout"
            onClick={handleLogout}
            style={{
              display:
                isAuthenticated && isAuthenticated !== "guest"
                  ? "inline"
                  : "none",
            }}
          >
            {lang === "English" ? "Log Out" : "Đăng Xuất"}
          </button>
          <Link
            to="/signup"
            className="link nav-link "
            style={{
              display:
                isAuthenticated && isAuthenticated !== "guest"
                  ? "none"
                  : "inline",
            }}
          >
            {lang === "English" ? "Sign Up" : "Đăng Ký"}
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
