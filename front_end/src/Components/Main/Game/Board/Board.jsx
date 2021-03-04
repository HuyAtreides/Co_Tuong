import React, { useEffect, useRef } from "react";
import initializeBoard from "./initializeBoard.js";
import Piece from "./Piece/Piece.jsx";
import "./Board.scss";
import { useSelector, useDispatch, useStore } from "react-redux";
import getSVGLocation from "./getSVGLocation.js";
import { io } from "socket.io-client";

function Board(props) {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.boardState.board);
  const targetDisplay = useSelector((state) => state.boardState.targetDisplay);
  const boardSize = useSelector((state) => state.boardState.boardSize);
  const currentPiece = useSelector((state) => state.boardState.currentPiece);
  const getClicked = useSelector((state) => state.boardState.getClicked);
  const draggable = useSelector((state) => state.boardState.draggable);
  const capturedPiece = useSelector((state) => state.boardState.capturedPiece);
  const turnToMove = useSelector((state) => state.boardState.turnToMove);
  const findingMatch = useSelector((state) => state.gameState.findingMatch);
  const side = useSelector((state) => state.boardState.side);
  const pause = useSelector((state) => state.gameState.pause);
  const socketRef = useRef();
  const svgRef = useRef();
  const timerRef = useRef();
  const messageToSend = useSelector((state) => state.gameState.messageToSend);
  const targetTranslate = useSelector(
    (state) => state.boardState.targetTranslate
  );
  const store = useStore();

  const setTimer = (playerMove) => {
    if (playerMove) {
      clearInterval(timerRef.current);
      dispatch({ type: "setOpponentTimeLeftToMove", value: "restart" });
      timerRef.current = setInterval(() => {
        dispatch({ type: "setPlayerTimeLeftToMove" });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      dispatch({ type: "setPlayerTimeLeftToMove", value: "restart" });
      timerRef.current = setInterval(() => {
        dispatch({ type: "setOpponentTimeLeftToMove" });
      }, 1000);
    }
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
        capturedPiece.push(board[newRow][newCol]);
        dispatch({ type: "setCapturedPiece", value: [...capturedPiece] });
      }
      board[curRow][curCol] = 0;
      board[newRow][newCol] = currentPiece;
    }
  };

  const handleOpponentMove = ([curRow, curCol], [newRow, newCol]) => {
    if (board[curRow][curCol] && board[curRow][curCol].side === side[0]) {
      board[curRow][curCol].animateMove([newRow, newCol], board, dispatch);
      dispatch({ type: "setTurnToMove", value: !turnToMove });
      setTimer(true);
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
        setTimer(false);
        socketRef.current.emit("opponentMove", newPosition, [curRow, curCol]);
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
      setTimer(false);
      socketRef.current.emit("opponentMove", newPosition, [curRow, curCol]);
    }
  };

  const handleClick = (event) => {
    if (currentPiece) {
      const svg = svgRef.current;
      const [x, y] = getSVGLocation(+event.clientX, +event.clientY, svg);
      if (!event.target.id) moveOnClick(currentPiece, x, y);
    }
  };

  const handleResize = () => {
    const width = document.querySelector(".board-container").offsetWidth;
    dispatch({
      type: "setBoardSize",
      value: [width, width / (521 / 577)],
    });
    dispatch({
      type: "setBoard",
      value: initializeBoard(width / 9, side),
    });
  };

  const registerEventHandler = () => {
    socketRef.current.on("foundMatch", (opponentID, firstMove) => {
      socketRef.current.opponentID = opponentID;
      dispatch({ type: "setFindingMatch", value: false });
      dispatch({ type: "setTurnToMove", value: firstMove });
      dispatch({ type: "setFoundMatch", value: true });
      setTimer(firstMove);
    });

    socketRef.current.on("incomingMessage", (message) => {
      const messagesLength = store.getState().gameState.messages.length;
      const listItemRef = React.createRef();
      const displayMess = (
        <li key={messagesLength} ref={listItemRef}>
          <span>Opponent</span>: {message}
        </li>
      );
      dispatch({ type: "setMessage", value: displayMess });
    });

    socketRef.current.on("timeout", () => {
      dispatch({ type: "setFindingMatch", value: null });
    });

    socketRef.current.on("move", ([curRow, curCol], [newRow, newCol]) => {
      handleOpponentMove([curRow, curCol], [newRow, newCol]);
    });
  };

  useEffect(() => {
    const width = document.querySelector(".board-container").offsetWidth;
    dispatch({
      type: "setBoardSize",
      value: [width, width / (521 / 577)],
    });
    dispatch({
      type: "setBoard",
      value: initializeBoard(width / 9, side),
    });

    window.ondragstart = () => false;
    socketRef.current = io("http://localhost:8080/play");
  }, []);

  useEffect(() => {
    if (findingMatch) {
      socketRef.current.emit("findMatch", side);
    } else if (messageToSend !== null) {
      socketRef.current.emit("sendMessage", messageToSend);
      dispatch({ type: "setMessageToSend", value: null });
    }

    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
    window.onresize = handleResize;
    registerEventHandler();

    return () => {
      window.onmouseup = null;
      window.onmousemove = null;
      window.onresize = null;
      socketRef.current.removeAllListeners();
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
        width={boardSize[0] / 9}
        height={boardSize[0] / 9}
        style={{ display: targetDisplay }}
        transform={targetTranslate}
      ></image>
      <Piece board={board} handleMouseDown={handleMouseDown} />
    </svg>
  );
}

export default Board;
