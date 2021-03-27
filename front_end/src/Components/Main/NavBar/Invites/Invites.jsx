import React, { useEffect, useContext, useState } from "react";
import { SocketContext } from "../../../App/context.js";
import renderInvites from "./renderInvites.js";
import "./Invites.scss";

const Invites = () => {
  const [invites, setInvites] = useState({});
  const socket = useContext(SocketContext);

  const handleAccept = (event) => {
    const playername = event.currentTarget.getAttribute("playername");
  };

  const handleDecline = (event) => {
    const playername = event.currentTarget.getAttribute("playername");
  };

  useEffect(() => {
    socket.on("receiveInvite", (sender, senderSocketID, time) => {
      if (Object.values(invites).length === 5)
        socket.emit("receiveTooManyInvites", senderSocketID);
      else
        setInvites((prevState) => {
          const newState = Object.assign({}, prevState);
          sender.socketID = senderSocketID;
          sender.time = time;
          newState[sender.playername] = sender;
          return newState;
        });
    });
  }, []);

  return (
    <ul className="invites-list">
      {renderInvites(invites, handleAccept, handleDecline)}
    </ul>
  );
};

export default Invites;
