//hsla(0, 0%, 100%, 0.4)
const renderMatchHistory = (playerInfo) => {
  const [playername, matches] = [playerInfo.username, playerInfo.matches];
  return matches.map((value, index) => {
    const option = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(value.date).toLocaleDateString("us-US", option);
    return (
      <tr className="game-table-row" key={`match-${index}`}>
        <td className="game-time">
          <div className="match-history-value">
            {" "}
            <i className="fas fa-clock" style={{ color: "#769656" }}></i>
            {value.time + " min"}
          </div>
        </td>
        <td className="players-name">
          <div className="match-history-value">
            <p>
              {value.result === "Draw" ? (
                <i className="fas fa-equals"></i>
              ) : (
                <i
                  className={`fas fa-${
                    value.result === "Won" ? "plus" : "minus"
                  }-square`}
                ></i>
              )}

              {playername}
            </p>
            <p>
              {value.result === "Draw" ? (
                <i className="fas fa-equals"></i>
              ) : (
                <i
                  className={`fas fa-${
                    value.result !== "Won" ? "plus" : "minus"
                  }-square`}
                ></i>
              )}
              {value.opponent}
            </p>
          </div>
        </td>
        <td></td>
        <td></td>
        <td></td>
        <td className="match-result">
          <div
            className="match-history-value"
            style={{
              color:
                value.result === "Won"
                  ? "#769656"
                  : value.result === "Draw"
                  ? "hsla(0, 0%, 100%, 0.4)"
                  : "#dc3545",
            }}
          >
            {value.result}
          </div>
        </td>
        <td className="match-result">
          <div className="match-history-value reason">{value.reason}</div>
        </td>
        <td className="match-date">
          <div>{date}</div>
        </td>
      </tr>
    );
  });
};

export default renderMatchHistory;
