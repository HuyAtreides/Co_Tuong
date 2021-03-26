const renderPendingPlayers = (pendingPlayers, cancelInvite) => {
  return Object.values(pendingPlayers).map((value, index) => {
    const { username, photo } = value;
    return (
      <li key={`pending-player-${index}`}>
        <div>
          <img src={photo} alt="" />
        </div>
        <p>{username}</p>
        <p className="pending">Pending...</p>
        <i
          className="fas fa-times"
          onClick={cancelInvite}
          playername={username}
        ></i>
      </li>
    );
  });
};

export default renderPendingPlayers;
