const renderMessages = (messages) => {
  const displayMessages = messages.map((element, index) => {
    if (element.type) {
      return (
        <li key={`m${index}`} ref={element.ref} className={element.className}>
          <p className="game-over">Game Over</p>
          <p>{`${element.winner}${element.reason}`}</p>
        </li>
      );
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
