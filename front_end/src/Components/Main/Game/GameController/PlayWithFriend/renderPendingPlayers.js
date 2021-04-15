const renderPendingPlayers = (pendingPlayers, cancelInvite, lang) => {
  return pendingPlayers.map((value, index) => {
    const { username, photo } = value;
    return (
      <li key={`pending-player-${index}`}>
        <div>
          <img src={photo} alt="" />
        </div>
        <p>{username}</p>
        <p className={value.declineInvite ? "decline" : "pending"}>
          {value.declineInvite
            ? lang === "English"
              ? "Declined"
              : "Từ Chối"
            : lang === "English"
            ? "Pending..."
            : "Đang Chờ..."}
        </p>
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
