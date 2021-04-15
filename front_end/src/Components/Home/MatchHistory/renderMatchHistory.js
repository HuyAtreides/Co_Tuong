//hsla(0, 0%, 100%, 0.4)
const renderMatchHistory = (playerInfo, lang) => {
  const [playername, matches] = [playerInfo.username, playerInfo.matches];
  return matches.map((value, index) => {
    let resultInVi = "Hòa";
    let reasonInVi = "Đồng Ý Hòa";

    if (value.result !== "Draw") {
      if (value.reason === "Game Abandoned") reasonInVi = "Trận Đấu Bị Hủy";
      else reasonInVi = "Chiếu Bí";
      if (value.result === "Won") resultInVi = "Thắng";
      else resultInVi = "Thua";
    }

    const option = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(value.date).toLocaleDateString(
      lang === "English" ? "us-US" : "vi-VI",
      option
    );
    return (
      <tr className="game-table-row" key={`match-${index}`}>
        <td className="game-time">
          <div className="match-history-value">
            {" "}
            <i className="fas fa-clock" style={{ color: "#769656" }}></i>
            {value.time + (lang === "English" ? " min" : " phút")}
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
            {lang === "English" ? value.result : resultInVi}
          </div>
        </td>
        <td className="match-result">
          <div className="match-history-value reason">
            {" "}
            {lang === "English" ? value.reason : reasonInVi}
          </div>
        </td>
        <td className="match-date">
          <div>{date}</div>
        </td>
      </tr>
    );
  });
};

export default renderMatchHistory;
