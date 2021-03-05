const renderMessages = (messages) => {
  const displayMessages = messages.map((element, index) => {
    if (element.type) {
      if (element.type === "draw message") {
        <li key={`m${index}`} ref={element.ref} className={element.className}>
          <p className="game-over">Game Over</p>
          <p>Draw</p>
        </li>;
      }
    }

    return (
      <li key={`m${index}`} ref={element.ref} className={element.className}>
        <span>{element.from}</span> {element.message}
      </li>
    );
  });
  return displayMessages;
};

export default renderMessages;
