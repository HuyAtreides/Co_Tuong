import React, { useEffect, useContext, useState } from "react";
import { SocketContext } from "../../../App/context.js";
import renderInvites from "./renderInvites.js";
import "./Invites.scss";

const Invites = () => {
  const [invites, setInvites] = useState({});
  const socket = useContext(SocketContext);

  const handleAccept = () => {};

  const handleDecline = () => {};

  useEffect(() => {
    socket.on("receiveInvite", (sender, senderSocketID) => {
      setInvites((prevState) => {
        const newState = Object.assign({}, prevState);
        sender.socketID = senderSocketID;
        newState[sender.playername] = sender;
        return newState;
      });
    });

    return () => {
      socket.removeAllListeners("receiveInvite");
    };
  });

  return (
    <ul className="invites-list">
      {renderInvites(invites, handleAccept, handleDecline)}
    </ul>
  );
};

export default Invites;
