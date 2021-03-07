import React, { useEffect, useRef } from "react";
import Piece from "./Piece/Piece.jsx";
import "./Board.scss";
import { useSelector, useDispatch } from "react-redux";
import getSVGLocation from "./getSVGLocation.js";
import GameResult from "../GamePlayArea/GameResult/GameResult.jsx";

function Board() {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.boardState.board);
  const targetDisplay = useSelector((state) => state.boardState.targetDisplay);
  const boardSize = useSelector((state) => state.boardState.boardSize);
  const currentPiece = useSelector((state) => state.boardState.currentPiece);
  const getClicked = useSelector((state) => state.boardState.getClicked);
  const draggable = useSelector((state) => state.boardState.draggable);
  const turnToMove = useSelector((state) => state.boardState.turnToMove);
  const side = useSelector((state) => state.boardState.side);
  const pause = useSelector((state) => state.gameState.pause);
  const svgRef = useRef();
  const timerRef = useRef();
  const targetTranslate = useSelector(
    (state) => state.boardState.targetTranslate
  );
  const sendGameResult = useSelector((state) => state.gameState.sendGameResult);
  const socket = useSelector((state) => state.appState.socket);
  const currentIntervalID = useSelector(
    (state) => state.appState.currentIntervalID
  );
  const gameResult = useSelector((state) => state.gameState.gameResult);

  const setTimer = (playerTurn, gameFinish) => {
    if (gameFinish) {
      clearInterval(timerRef.current);
      dispatch({ type: "setOpponentTimeLeftToMove", value: "restart" });
      dispatch({ type: "setPlayerTimeLeftToMove", value: "restart" });
      dispatch({ type: "setTurnToMove", value: false });
      return;
    }
    if (playerTurn) {
      clearInterval(timerRef.current);
      dispatch({ type: "setOpponentTimeLeftToMove", value: "restart" });
      timerRef.current = setInterval(() => {
        dispatch({ type: "setPlayerTimeLeftToMove", value: null });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      dispatch({ type: "setPlayerTimeLeftToMove", value: "restart" });
      timerRef.current = setInterval(() => {
        dispatch({ type: "setOpponentTimeLeftToMove", value: null });
      }, 1000);
    }
    dispatch({ type: "setCurrentIntervalID", value: timerRef.current });
  };

  const handleMouseDown = (event) => {
    const elementId = event.currentTarget.id;
    const [row, col] = [+elementId[1], +elementId[2]];
    const translate = board[row][col].translate;
    if (!currentPiece || board[row][col].side === currentPiece.side) {
      if (currentPiece) {
        const [curRow, curCol] = currentPiece.position;
        if (row !== curRow || curCol !== col) {
          dispatch({ type: "setGetClicked", value: false });
        }
      }
      dispatch({ type: "setTargetDisplay", value: "inline" });
      dispatch({ type: "setDraggable", value: true });
      dispatch({ type: "setTargetTranslate", value: translate });
      dispatch({ type: "setCurrentPiece", value: board[row][col] });
    }
  };

  const updateBoard = (newPostion, [curRow, curCol]) => {
    if (newPostion) {
      const [capture, newRow, newCol] = newPostion;
      if (capture) {
        dispatch({ type: "setCapturedPieces", value: board[newRow][newCol] });
      }
      board[curRow][curCol] = 0;
      board[newRow][newCol] = currentPiece;
    }
  };

  const handleOpponentMove = ([curRow, curCol], [newRow, newCol]) => {
    if (board[curRow][curCol] && board[curRow][curCol].side === side[0]) {
      board[curRow][curCol].animateMove([newRow, newCol], board, dispatch);
      setTimer(true, false);
    }
  };

  const updateCurrentPiece = (newPosition) => {
    if (newPosition || getClicked) {
      dispatch({ type: "setTargetDisplay", value: "none" });
      dispatch({ type: "setCurrentPiece", value: null });
      dispatch({ type: "setGetClicked", value: false });
    } else {
      dispatch({ type: "setGetClicked", value: true });
    }
  };

  const handleMouseUp = (event) => {
    if (currentPiece) {
      const svg = svgRef.current;
      const [x, y] = getSVGLocation(+event.clientX, +event.clientY, svg);
      const [curRow, curCol] = currentPiece.position;
      const newPosition = currentPiece.setNewPosition(x, y, board, turnToMove);
      updateBoard(newPosition, [curRow, curCol]);
      dispatch({ type: "setDraggable", value: false });
      updateCurrentPiece(newPosition);
      dispatch({ type: "setBoard", value: [...board] });
      if (newPosition) {
        dispatch({ type: "setTurnToMove", value: !turnToMove });
        setTimer(false, false);
        socket.emit("opponentMove", newPosition, [curRow, curCol]);
      }
    }
  };

  const handleMouseMove = (event) => {
    const svg = svgRef.current;
    const [x, y] = getSVGLocation(+event.clientX, +event.clientY, svg);
    if (x >= 0 && x < boardSize[0] && y >= 0 && y < boardSize[1] && draggable) {
      currentPiece.move(x, y, board);
      dispatch({ type: "setBoard", value: [...board] });
    }
  };

  const moveOnClick = (currentPiece, x, y) => {
    const [curRow, curCol] = currentPiece.position;
    const newPosition = currentPiece.setNewPosition(x, y, board, turnToMove);
    updateBoard(newPosition, [curRow, curCol]);
    dispatch({ type: "setTargetDisplay", value: "none" });
    dispatch({ type: "setCurrentPiece", value: null });
    dispatch({ type: "setBoard", value: [...board] });
    if (newPosition) {
      dispatch({ type: "setTurnToMove", value: !turnToMove });
      setTimer(false, false);
      socket.emit("opponentMove", newPosition, [curRow, curCol]);
    }
  };

  const handleClick = (event) => {
    if (currentPiece) {
      const svg = svgRef.current;
      const [x, y] = getSVGLocation(+event.clientX, +event.clientY, svg);
      if (!event.target.id) moveOnClick(currentPiece, x, y);
    }
  };

  const constructNewBoard = (width) => {
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
    const width = document.querySelector(".board-container").offsetWidth;
    dispatch({
      type: "setBoardSize",
      value: [width, width / (521 / 577)],
    });
    dispatch({
      type: "setBoard",
      value: constructNewBoard(width / 9),
    });
  };

  const registerEventHandler = () => {
    socket.on("foundMatch", (opponentID, firstMove) => {
      socket.opponentID = opponentID;
      dispatch({ type: "setTurnToMove", value: firstMove });
      dispatch({ type: "setFoundMatch", value: true });
      setTimer(firstMove);
    });

    socket.on("move", ([curRow, curCol], [newRow, newCol]) => {
      handleOpponentMove([curRow, curCol], [newRow, newCol]);
    });

    socket.on("gameOver", (result, reason) => {
      if (gameResult !== null) return;
      const listItemRef = React.createRef();
      if (result === "Draw") {
        dispatch({ type: "setGameResult", value: "Draw" });
        dispatch({
          type: "setMessage",
          value: {
            type: "game result message",
            winner: "",
            reason: "Game Draw By Agreement",
            className: "game-message",
            ref: listItemRef,
          },
        });
      } else {
        dispatch({ type: "setGameResult", value: result });
        dispatch({
          type: "setMessage",
          value: {
            type: "game result message",
            winner: `${result === "Won" ? "Phan Gia Huy" : "Opponent"} Won - `,
            reason: reason,
            className: "game-message",
            ref: listItemRef,
          },
        });
      }
      setTimer(null, true);
    });
  };

  useEffect(() => {
    const width = document.querySelector(".board-container").offsetWidth;
    dispatch({ type: "setBoardSize", value: [width, width / (521 / 577)] });
    dispatch({ type: "setBoard", value: constructNewBoard(width / 9) });

    window.ondragstart = () => false;

    if (currentIntervalID) timerRef.current = currentIntervalID;
  }, []);

  useEffect(() => {
    if (sendGameResult) {
      socket.emit("gameFinish", sendGameResult);
      setTimer(null, true);
      dispatch({ type: "setSendGameResult", value: false });
    }

    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
    window.onresize = handleResize;
    registerEventHandler();

    return () => {
      window.onmouseup = null;
      window.onmousemove = null;
      window.onresize = null;
      socket.removeAllListeners("foundMatch");
      socket.removeAllListeners("gameOver");
      socket.removeAllListeners("move");
    };
  });

  return (
    <svg
      width={boardSize[0]}
      height={boardSize[1]}
      onClick={handleClick}
      style={{
        backgroundImage: "url(/images/Board/board.jpg)",
      }}
      ref={svgRef}
    >
      <image
        href="/images/Target_Icon/target.gif"
        width={boardSize[0] / 9 - 3}
        height={boardSize[0] / 9 - 3}
        style={{ display: targetDisplay }}
        transform={targetTranslate}
      ></image>
      <Piece board={board} handleMouseDown={handleMouseDown} />
    </svg>
  );
}

export default React.memo(Board);
