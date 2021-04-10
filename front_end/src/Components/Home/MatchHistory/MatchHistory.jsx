import React from "react";
import { useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import renderMatchHistory from "./renderMatchHistory.js";
import "./MatchHistory.scss";

const MatchHistory = (props) => {
  const playerInfo = useSelector((state) => state.appState.playerInfo);
  const [won, lost, draw] = playerInfo.matches.reduce(
    (acc, value) => {
      if (value.result === "Won") acc[0] += 1;
      else if (value.result === "Draw") acc[2] += 1;
      else acc[1] += 1;
      return acc;
    },
    [0, 0, 0]
  );

  return (
    <div className="match-history-container">
      <div className="match-history-title">
        <p>Matches History</p>
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
          You need to verify your email to view you matches history. Please
          click <Link to="/verify-email">here</Link> to verify your email.
        </p>
      )}
    </div>
  );
};

export default MatchHistory;
