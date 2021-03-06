const renderMessages = (messages, lang) => {
  const displayMessages = messages.map((element, index) => {
    if (element.type) {
      return (
        <li key={`m${index}`} id={`m${index}`} className={element.className}>
          <p className="game-over">
            {lang === "English" ? "Game Over" : "Trận Đấu Kết Thúc"}
          </p>
          <p>{`${element.winner}${element.reason}`}</p>
        </li>
      );
    }

    return (
      <li key={`m${index}`} id={`m${index}`} className={element.className}>
        <span>{element.from}</span> {element.message}
      </li>
    );
  });
  return displayMessages;
};

export default renderMessages;
