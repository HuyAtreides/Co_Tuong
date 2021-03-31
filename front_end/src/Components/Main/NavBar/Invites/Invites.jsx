import React, { useEffect, useContext, useState } from "react";
import { SocketContext } from "../../../App/context.js";
import renderInvites from "./renderInvites.js";
import "./Invites.scss";

const Invites = () => {
  const [invites, setInvites] = useState({});
  const socket = useContext(SocketContext);

  const handleAccept = (event) => {
    const playername = event.currentTarget.getAttribute("playername");
    const { time, socketID } = invites[playername];
    socket.emit("acceptInvite", socketID, time);
    setInvites({});
  };

  const handleDecline = (event) => {
    const playername = event.currentTarget.getAttribute("playername");
    setInvites((prevState) => {
      const newState = Object.assign({}, prevState);
      delete newState[playername];
      return newState;
    });
    socket.emit("declineInvite", invites[playername].socketID, false);
  };

  useEffect(() => {
    socket.on("receiveInvite", (sender, senderSocketID, time) => {
      setInvites((prevState) => {
        const newState = Object.assign({}, prevState);
        sender.socketID = senderSocketID;
        sender.time = time;
        newState[sender.playername] = sender;
        return newState;
      });
      socket.emit("inviteReceived", senderSocketID);
    });

    socket.on("clearInvites", () => {
      setInvites({});
    });

    socket.on("inviteCanceled", (senderInfo) => {
      setInvites((prevState) => {
        const newState = Object.assign({}, prevState);
        if (!newState[senderInfo.playername]) return prevState;
        newState[senderInfo.playername].cancelInvite = true;
        return newState;
      });
      setTimeout(() => {
        setInvites((prevState) => {
          const newState = Object.assign({}, prevState);
          if (!newState[senderInfo.playername]) return prevState;
          delete newState[senderInfo.playername];
          return newState;
        });
      }, 1000);
    });

    return () => {
      socket.removeAllListeners("receiveInvite");
      socket.removeAllListeners("inviteCanceled");
      socket.removeAllListeners("clearInvites");
    };
  }, [invites]);

  useEffect(() => {
    return () => {
      socket.emit("declineInvite", null, true);
    };
  }, []);

  return (
    <ul className="invites-list">
      {renderInvites(invites, handleAccept, handleDecline)}
    </ul>
  );
};

export default Invites;
