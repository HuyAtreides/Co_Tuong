const renderPlayersList = (players, handleSelectPlayer, name) => {
  const playersList = players.map((player, index) => {
    const { username, photo, socketID } = player;
    if (username === name) return null;
    return (
      <li
        key={`player${index}`}
        onClick={handleSelectPlayer}
        playername={username}
      >
        <div className="img-container">
          <img src={photo}></img>
        </div>
        <p>{username}</p>
        <div className="status">
          <span
            style={{ backgroundColor: socketID ? "#28a745" : "#6c757d" }}
          ></span>
        </div>
      </li>
    );
  });
  return playersList;
};

export default renderPlayersList;
