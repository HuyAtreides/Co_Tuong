import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "react-bootstrap";
import "./ChatSection.scss";

const ChatSection = () => {
  const dispatch = useDispatch();
  const offeredADraw = useSelector((state) => state.gameState.offeredADraw);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef();
  const messages = useSelector((state) => state.gameState.messages);
  const [hideChat, setHideChat] = useState(false);

  const handleAcceptOffer = () => {};

  const handleDeclineOffer = () => {};

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
    const ref = React.createRef();
    const displayMess = (
      <li key={messages.length} ref={ref}>
        <span>Phan Gia Huy</span>: {input}
      </li>
    );
    dispatch({ type: "setMessage", value: displayMess });
    setInput("");
    dispatch({ type: "setMessageToSend", value: input });
    event.preventDefault();
  };

  useEffect(() => {
    if (messages.length > 0) {
      const list = messagesContainerRef.current;
      const lastListItem = messages[messages.length - 1].ref.current;
      if (lastListItem) list.scrollTop = lastListItem.offsetTop;
    }
  });

  return hideChat ? (
    <Button className="show-chat" onClick={handleShowChat}>
      Show Chat
    </Button>
  ) : (
    <div className="chat-section">
      <i className="fas fa-times hide-chat" onClick={handleHideChat}></i>
      <ul className="message-container" ref={messagesContainerRef}>
        <li className="announce-new-game">
          <p className="versus">
            <span>Opponent</span> vs <span>Phan Gia Huy</span>
          </p>
        </li>
        {offeredADraw ? (
          <li className="draw-offer">
            <p>
              <span>Opponent</span> Offer A Draw
            </p>
            <div className="answer">
              <Button className="accept-offer" onClick={handleAcceptOffer}>
                Accept <i className="fas fa-check"></i>
              </Button>
              <Button className="decline-offer" onClick={handleDeclineOffer}>
                Decline <i className="fas fa-times"></i>
              </Button>
            </div>
          </li>
        ) : null}
        {messages}
      </ul>
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