import React from "react";
import EntryComponent from "./EntryComponent/EntryComponent.jsx";

const Main = (props) => {
  return (
    <div className="main-page">
      <NavBar />
      <EntryComponent />
    </div>
  );
};

export default Main;
