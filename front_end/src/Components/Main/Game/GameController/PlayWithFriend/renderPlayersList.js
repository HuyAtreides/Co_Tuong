const renderPlayersList = (players, handleSelectPlayer) => {
  const playersList = players.map((player, index) => {
    const { username, photo } = player;
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
      </li>
    );
  });
  return playersList;
};

export default renderPlayersList;
