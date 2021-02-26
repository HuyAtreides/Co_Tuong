import React, { useState, useEffect, useRef, useReducer } from "react";
import initializeBoard from "../../initializeBoard";
import Piece from "../Piece/Piece.jsx";
import "./Board.scss";
import { useSelector, useDispatch } from "react-redux";
import getSVGLocation from "../../getSVGLocation.js";
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
  const findMatch = useSelector((state) => state.boardState.findMatch);
  const turnToMove = useSelector((state) => state.boardState.turnToMove);
  const socketRef = useRef();
  const svgRef = useRef();
  const targetTranslate = useSelector(
    (state) => state.boardState.targetTranslate
  );

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
    if (board[curRow][curCol] && board[curRow][curCol].side === props.side[0]) {
      board[curRow][curCol].animateMove([newRow, newCol], board, dispatch);
      dispatch({ type: "setTurnToMove", value: !turnToMove });
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
      if (!getClicked) {
        dispatch({ type: "setGetClicked", value: true });
      } else {
        dispatch({ type: "setTargetDisplay", value: "none" });
        dispatch({ type: "setCurrentPiece", value: null });
        dispatch({ type: "setGetClicked", value: false });
      }
      dispatch({ type: "setBoard", value: [...board] });
      if (newPosition) {
        dispatch({ type: "setTurnToMove", value: !turnToMove });
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

  useEffect(() => {
    const width = +window.innerWidth;
    const boardWidth = width * (90 / 100);
    if (width < 525) {
      dispatch({
        type: "setBoardSize",
        value: [boardWidth, boardWidth / (521 / 577)],
      });
      dispatch({
        type: "setBoard",
        value: initializeBoard(boardWidth / 9, props.side),
      });
    }
    window.ondragstart = () => false;
    socketRef.current = io("http://localhost:8080/play");
  }, []);

  useEffect(() => {
    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
    socketRef.current.on("foundMatch", (opponentId, firstMove) => {
      dispatch({ type: "setTurnToMove", value: firstMove });
      socketRef.current.opponentId = opponentId;
      dispatch({ type: "setFindMatch", value: `foundMatch ${opponentId}` });
    });

    socketRef.current.on("timeout", () => {
      dispatch({ type: "setFindMatch", value: "no players online" });
    });

    socketRef.current.once("move", ([curRow, curCol], [newRow, newCol]) => {
      handleOpponentMove([curRow, curCol], [newRow, newCol]);
    });

    return () => {
      socketRef.current.removeAllListeners();
    };
  });

  const startPlay = () => {
    dispatch({ type: "setFindMatch", value: "findMatch" });
    socketRef.current.emit("findMatch");
  };

  return (
    <div>
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
      <span>{findMatch}</span>
      <button onClick={startPlay}>play</button>
    </div>
  );
}

export default Board;
