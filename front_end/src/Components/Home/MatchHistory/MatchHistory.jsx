import React from 'react';
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';
import renderMatchHistory from './renderMatchHistory.js';
import './MatchHistory.scss';

const MatchHistory = ({ playerInfo, viewOthersProfile }) => {
  const { won, lost, draw } = playerInfo.totalGames;
  const lang = useSelector((state) => state.appState.lang);

  return (
    <div className='match-history-container'>
      <div className='match-history-title'>
        <p>
          {lang === 'English'
            ? 'Match History(Last 20 Played)'
            : 'Lịch Sử Đấu(20 trận gần nhất)'}
        </p>
        <p>{`${won > 10000 ? '10000+' : won}W/${lost > 10000 ? '10000+' : lost}L/${
          draw > 10000 ? '10000+' : draw
        }D`}</p>
      </div>

      <Table borderless responsive={true}>
        <thead>
          <tr>
            <th></th>
            <th>{lang === 'English' ? 'Players' : 'Người Chơi'}</th>
            <th></th>
            <th></th>
            <th></th>
            <th>{lang === 'English' ? 'Result' : 'Kết Quả'}</th>
            <th>{lang === 'English' ? 'Reason' : 'Lý Do'}</th>
            <th className='date-head'>{lang === 'English' ? 'Date' : 'Ngày'}</th>
          </tr>
        </thead>
        <tbody>{renderMatchHistory(playerInfo, lang)}</tbody>
      </Table>
    </div>
  );
};

export default MatchHistory;
