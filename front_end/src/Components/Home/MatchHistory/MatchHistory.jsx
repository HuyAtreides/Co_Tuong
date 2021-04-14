import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import renderMatchHistory from "./renderMatchHistory.js";
import "./MatchHistory.scss";

const MatchHistory = ({ playerInfo, viewOthersProfile }) => {
  const { won, lost, draw } = playerInfo.totalGames;

  return (
    <div className="match-history-container">
      <div className="match-history-title">
        <p>Match History(Last 20 Played)</p>
        <p>{`${won > 10000 ? "10000+" : won}W/${
          lost > 10000 ? "10000+" : lost
        }L/${draw > 10000 ? "10000+" : draw}D`}</p>
      </div>
      {playerInfo.email.verified ? (
        <Table borderless responsive={true}>
          <thead>
            <tr>
              <th></th>
              <th>Players</th>
              <th></th>
              <th></th>
              <th></th>
              <th>Result</th>
              <th>Reason</th>
              <th className="date-head">Date</th>
            </tr>
          </thead>
          <tbody>{renderMatchHistory(playerInfo)}</tbody>
        </Table>
      ) : (
        <p id="verify-email-note">
          {viewOthersProfile ? (
            "User's match history isn't available."
          ) : (
            <>
              You need to verify your email to view your match history. Please
              click <Link to="/verify-email">here</Link> to verify your email or{" "}
              <Link to="/settings">here</Link> to change your email.
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default MatchHistory;
