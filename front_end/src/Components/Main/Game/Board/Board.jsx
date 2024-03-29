import React, { useEffect, useRef, useContext, useState } from 'react';
import Piece from './Piece/Piece.jsx';
import './Board.scss';
import { useSelector, useDispatch, useStore } from 'react-redux';
import getSVGLocation from './getSVGLocation.js';
import { SocketContext, SetMoveTimerContext } from '../../../App/context.js';
import PieceClass from '../../../../pieces/piece.js';
import MoveHint from './MoveHint/MoveHint.jsx';

function Board() {
  const dispatch = useDispatch();
  const store = useStore();
  const lang = useSelector((state) => state.appState.lang);
  const board = useSelector((state) => state.boardState.board);
  const targetDisplay = useSelector((state) => state.boardState.targetDisplay);
  const boardSize = useSelector((state) => state.boardState.boardSize);
  const currentPiece = useSelector((state) => state.boardState.currentPiece);
  const getClicked = useSelector((state) => state.boardState.getClicked);
  const draggable = useSelector((state) => state.boardState.draggable);
  const [warningDisplay, setWarningDisplay] = useState('none');
  const [warningTranslate, setWarningTranslate] = useState('translate(0, 0)');
  const side = useSelector((state) => state.boardState.side);
  const svgRef = useRef();
  const targetTranslate = useSelector((state) => state.boardState.targetTranslate);
  const turnToMove = useSelector((state) => state.boardState.turnToMove);
  const socket = useContext(SocketContext);
  const setMoveTimer = useContext(SetMoveTimerContext);

  const opponentInfo = useSelector((state) => state.gameState.opponentInfo);

  const handleMouseDown = (event) => {
    const gameResult = store.getState().gameState.gameResult;
    if (gameResult !== null) return;
    const elementId = event.currentTarget.id;
    const [row, col] = [+elementId[1], +elementId[2]];
    const translate = board[row][col].translate;
    if (!currentPiece || board[row][col].side === currentPiece.side) {
      if (currentPiece) {
        const [curRow, curCol] = currentPiece.position;
        if (row !== curRow || curCol !== col) {
          currentPiece.showMoveHints('off', board);
          dispatch({ type: 'setGetClicked', value: false });
        }
      }
      board[row][col].showMoveHints('on', board);
      dispatch({ type: 'setBoard', value: [...board] });
      dispatch({ type: 'setTargetDisplay', value: 'inline' });
      dispatch({ type: 'setDraggable', value: true });
      dispatch({ type: 'setTargetTranslate', value: translate });
      dispatch({ type: 'setCurrentPiece', value: board[row][col] });
    }
  };

  const updateBoard = (moveResult, [curRow, curCol]) => {
    if (moveResult && !/translate/.test(moveResult)) {
      const [capture, newRow, newCol] = moveResult;
      if (capture) {
        dispatch({ type: 'setCapturedPieces', value: board[newRow][newCol] });
      }
      board[curRow][curCol] = 0;
      board[newRow][newCol] = currentPiece;
    } else if (moveResult) {
      setTimeout(() => {
        setWarningDisplay('none');
      }, 400);
      setWarningDisplay('inline');
      setWarningTranslate(moveResult);
    }
  };

  const handleOpponentMove = ([curRow, curCol], [newRow, newCol]) => {
    if (board[curRow][curCol] && board[curRow][curCol].side === side[0]) {
      dispatch({ type: 'setOpponentTimeLeftToMove', value: 'restart' });
      board[curRow][curCol].animateMove([newRow, newCol], board, dispatch);
      socket.emit('finishMove');
      dispatch({ type: 'setTurnToMove', value: true });
    }
  };

  const updateCurrentPiece = (moveResult) => {
    if ((moveResult && !/translate/.test(moveResult)) || getClicked) {
      currentPiece.showMoveHints('off', board);
      dispatch({ type: 'setTargetDisplay', value: 'none' });
      dispatch({ type: 'setCurrentPiece', value: null });
      dispatch({ type: 'setGetClicked', value: false });
    } else {
      dispatch({ type: 'setGetClicked', value: true });
    }
  };

  const movePiece = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let moveResult = null;
    const svg = svgRef.current;
    const [x, y] = getSVGLocation(+event.clientX, +event.clientY, svg);
    const newCol = Math.floor(x / currentPiece.width);
    const newRow = Math.floor(y / currentPiece.width);
    const [curRow, curCol] = currentPiece.position;
    const canMove = currentPiece.canMoveToNewPosition(newRow, newCol, board);
    if (turnToMove && canMove && !/translate/.test(canMove))
      moveResult = currentPiece.setPosition(canMove, newRow, newCol);
    else if (/translate/.test(canMove)) moveResult = canMove;
    updateBoard(moveResult, [curRow, curCol]);
    dispatch({ type: 'setDraggable', value: false });
    updateCurrentPiece(moveResult);
    dispatch({ type: 'setBoard', value: [...board] });
    if (moveResult && !/translate/.test(moveResult)) {
      dispatch({ type: 'setPlayerTimeLeftToMove', value: 'restart' });
      dispatch({ type: 'setTurnToMove', value: !turnToMove });
      socket.emit('opponentMove', moveResult, [curRow, curCol]);
    }
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    const gameResult = store.getState().gameState.gameResult;
    if (currentPiece && gameResult === null) {
      movePiece(event);
    }
  };

  const handleMouseMove = (event) => {
    const svg = svgRef.current;
    const [x, y] = getSVGLocation(+event.clientX, +event.clientY, svg);
    if (x >= 0 && x < boardSize[0] && y >= 0 && y < boardSize[1] && draggable) {
      currentPiece.move(x, y);
      dispatch({ type: 'setBoard', value: [...board] });
    }
  };

  const handleClick = (event) => {
    if (currentPiece) {
      const gameResult = store.getState().gameState.gameResult;
      if (!event.target.id && gameResult === null) movePiece(event);
    }
  };

  const constructNewPiecesWidth = (width) => {
    const newBoard = board.map((row) => {
      const newRow = row.map((piece) => {
        if (piece) {
          const [row, col] = piece.position;
          piece.width = width;
          piece.translate = `translate(${width * col}, ${width * row})`;
          return piece;
        }
        return 0;
      });
      return newRow;
    });
    return newBoard;
  };

  const handleResize = () => {
    const width = document.querySelector('.board-container').offsetWidth;
    dispatch({
      type: 'setBoardSize',
      value: [width, width / (521 / 577)],
    });
    dispatch({
      type: 'setBoard',
      value: constructNewPiecesWidth(width / 9),
    });
  };

  useEffect(() => {
    const width = document.querySelector('.board-container').offsetWidth;
    dispatch({ type: 'setBoardSize', value: [width, width / (521 / 577)] });
    dispatch({ type: 'setBoard', value: constructNewPiecesWidth(width / 9) });
    window.ondragstart = () => false;

    socket.on('setTimer', () => {
      const turnToMove = store.getState().boardState.turnToMove;
      const gameResult = store.getState().gameState.gameResult;
      if (gameResult == null) setMoveTimer(turnToMove, false, dispatch);
    });

    return () => {
      socket.removeAllListeners('setTimer');
    };
  }, []);

  useEffect(() => {
    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
    window.onresize = handleResize;
    socket.on('move', ([curRow, curCol], [newRow, newCol]) => {
      const gameResult = store.getState().gameState.gameResult;
      if (gameResult === null) handleOpponentMove([curRow, curCol], [newRow, newCol]);
    });

    return () => {
      window.onmouseup = null;
      window.onmousemove = null;
      window.onresize = null;
      socket.removeAllListeners('move');
    };
  });

  useEffect(() => {
    if (turnToMove && !draggable) {
      const lostReason = PieceClass.isLost(board, side[1]);
      if (lostReason) {
        let message = lostReason;
        if (lang !== 'English')
          message = lostReason === 'Checkmate' ? 'Chiếu Bí' : 'Hết Cờ';
        dispatch({ type: 'setGameResult', value: 'Lose' });
        dispatch({
          type: 'setMessage',
          value: {
            type: 'game result message',
            winner: `${opponentInfo.playername} ${
              lang === 'English' ? 'Won' : 'Thắng'
            } - `,
            reason: message,
            className: 'game-message',
          },
        });
        setMoveTimer(null, true, dispatch);
        socket.emit('gameFinish', ['Won', lostReason]);
        return;
      }
    }
  }, [turnToMove, board, draggable]);

  return (
    <svg
      width={boardSize[0]}
      height={boardSize[1]}
      onClick={handleClick}
      style={{
        backgroundImage: 'url("images/Board/board.jpg")',
      }}
      ref={svgRef}
    >
      <image
        href='images/Target_Icon/target.gif'
        width={boardSize[0] / 9 - 3}
        height={boardSize[0] / 9 - 3}
        style={{ display: targetDisplay }}
        transform={targetTranslate}
      ></image>
      <MoveHint board={board} boardWidth={boardSize[0]} />
      <Piece
        board={board}
        handleMouseDown={handleMouseDown}
        side={side}
        turnToMove={turnToMove}
      />

      <image
        href='images/Legal_Capture_Icon/legal_capture.png'
        transform={warningTranslate}
        style={{ display: warningDisplay, opacity: '0.6' }}
        width={boardSize[0] / 9 - 3}
        height={boardSize[0] / 9 - 3}
      ></image>
    </svg>
  );
}

export default React.memo(Board);
