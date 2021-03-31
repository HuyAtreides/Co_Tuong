import React, { useState, useRef, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import "./ChatSection.scss";
import renderMessages from "./renderMessages.js";
import DrawOffer from "./DrawOffer/DrawOffer.jsx";
import { SocketContext } from "../../../../App/context.js";

const ChatSection = () => {
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef();
  const messages = useSelector((state) => state.gameState.messages);
  const [hideChat, setHideChat] = useState(false);
  const displayMessages = renderMessages(messages);
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const opponentInfo = useSelector((state) => state.gameState.opponentInfo);

  const handleOnChange = (event) => {
    setInput(event.currentTarget.value);
  };

  const handleHideChat = () => {
    setHideChat(true);
  };

  const handleShowChat = () => {
    setHideChat(false);
  };

  const handleSendMessage = (event) => {
    if (input) {
      const message = {
        from: `${playerInfo.username}: `,
        message: input,
        className: "",
      };
      dispatch({ type: "setMessage", value: message });
      setInput("");
      socket.emit("sendMessage", message);
      event.preventDefault();
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      const list = messagesContainerRef.current;
      const lastListItem = document.querySelector(`#m${messages.length - 1}`);
      if (lastListItem) {
        list.scrollTop = lastListItem.offsetTop;
      }
    }
    socket.on("incomingMessage", (message) => {
      if (message.from && message.className !== "game-message")
        message.from = `${opponentInfo.playername}: `;
      dispatch({ type: "setMessage", value: message });
    });

    return () => {
      socket.removeAllListeners("incomingMessage");
    };
  });

  return hideChat ? (
    <Button className="show-chat" onClick={handleShowChat}>
      Show Chat
      <DrawOffer display="none" />
    </Button>
  ) : (
    <div className="chat-section">
      <i className="fas fa-times hide-chat" onClick={handleHideChat}></i>
      <ul className="message-container" ref={messagesContainerRef}>
        <li className="announce-new-game">
          <p className="versus game-message">
            <span>{opponentInfo.playername}</span> vs{" "}
            <span>{playerInfo.username}</span>
          </p>
        </li>
        {displayMessages}
      </ul>
      <DrawOffer display="flex" />
      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Message..."
          onChange={handleOnChange}
          value={input}
        />
        <Button className="send-btn" type="submit">
          Send
        </Button>
      </form>
    </div>
  );
};

export default ChatSection;
