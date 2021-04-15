import React from "react";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import renderMatchHistory from "./renderMatchHistory.js";
import "./MatchHistory.scss";

const MatchHistory = ({ playerInfo, viewOthersProfile }) => {
  const { won, lost, draw } = playerInfo.totalGames;
  const lang = useSelector((state) => state.appState.lang);

  return (
    <div className="match-history-container">
      <div className="match-history-title">
        <p>
          {lang === "English"
            ? "Match History(Last 20 Played)"
            : "Lịch Sử Đấu(20 trận gần nhất)"}
        </p>
        <p>{`${won > 10000 ? "10000+" : won}W/${
          lost > 10000 ? "10000+" : lost
        }L/${draw > 10000 ? "10000+" : draw}D`}</p>
      </div>
      {playerInfo.email.verified ? (
        <Table borderless responsive={true}>
          <thead>
            <tr>
              <th></th>
              <th>{lang === "English" ? "Players" : "Người Chơi"}</th>
              <th></th>
              <th></th>
              <th></th>
              <th>{lang === "English" ? "Result" : "Kết Quả"}</th>
              <th>{lang === "English" ? "Reason" : "Lý Do"}</th>
              <th className="date-head">
                {lang === "English" ? "Date" : "Ngày"}
              </th>
            </tr>
          </thead>
          <tbody>{renderMatchHistory(playerInfo, lang)}</tbody>
        </Table>
      ) : (
        <p id="verify-email-note">
          {viewOthersProfile ? (
            lang === "English" ? (
              "User's match history isn't available."
            ) : (
              "Lịch sử đấu của người chơi hiện khả dụng."
            )
          ) : lang === "English" ? (
            <>
              You need to verify your email to view your match history. Please
              click <Link to="/verify-email">here</Link> to verify your email or{" "}
              <Link to="/settings">here</Link> to change your email.
            </>
          ) : (
            <>
              Bạn cần phải xác nhận email để xem lịch sử đấu. Xin hãy nhấp vào{" "}
              <Link to="/verify-email">đây</Link> để xác nhận email hoặc vào{" "}
              <Link to="/settings">đây</Link> để thay đổi email.
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default MatchHistory;
