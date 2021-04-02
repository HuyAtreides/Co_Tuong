import React, { useEffect, useContext, useState } from "react";
import { SocketContext } from "../../../App/context.js";
import renderInvites from "./renderInvites.js";
import "./Invites.scss";

const Invites = () => {
  const [invites, setInvites] = useState([]);
  const socket = useContext(SocketContext);

  const handleAccept = (event) => {
    const playername = event.currentTarget.getAttribute("playername");
    const index = invites.findIndex(
      (player) => player.playername === playername
    );
    const { time, socketID } = invites[index];
    socket.emit("acceptInvite", socketID, time);
    setInvites([]);
  };

  const handleDecline = (event) => {
    const playername = event.currentTarget.getAttribute("playername");
    const index = invites.findIndex(
      (player) => player.playername === playername
    );
    socket.emit("declineInvite", invites[index].socketID, false);
    setInvites((prevState) => {
      prevState.splice(index, 1);
      return [...prevState];
    });
  };

  useEffect(() => {
    socket.on("receiveInvite", (sender, senderSocketID, time) => {
      setInvites((prevState) => {
        sender.socketID = senderSocketID;
        sender.time = time;
        prevState.push(sender);
        return [...prevState];
      });
      socket.emit("inviteReceived", senderSocketID);
    });

    socket.on("clearInvites", () => {
      setInvites([]);
    });

    socket.on("inviteCanceled", (senderInfo) => {
      const index = invites.findIndex(
        (player) => player.playername === senderInfo.playername
      );
      if (index !== -1) {
        setInvites((prevState) => {
          prevState[index].cancelInvite = true;
          return [...prevState];
        });
        setTimeout(() => {
          setInvites((prevState) => {
            prevState.splice(index, 1);
            return [...prevState];
          });
        }, 1000);
      }
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
