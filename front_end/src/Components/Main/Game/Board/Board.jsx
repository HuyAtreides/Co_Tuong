import React, { useEffect, useRef, useContext } from "react";
import Piece from "./Piece/Piece.jsx";
import "./Board.scss";
import { useSelector, useDispatch } from "react-redux";
import getSVGLocation from "./getSVGLocation.js";
import { SocketContext, SetTimerContext } from "../../../App/context.js";

function Board() {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.boardState.board);
  const targetDisplay = useSelector((state) => state.boardState.targetDisplay);
  const boardSize = useSelector((state) => state.boardState.boardSize);
  const currentPiece = useSelector((state) => state.boardState.currentPiece);
  const getClicked = useSelector((state) => state.boardState.getClicked);
  const draggable = useSelector((state) => state.boardState.draggable);
  // const pause = useSelector((state) => state.gameState.pause);
  const side = useSelector((state) => state.boardState.side);
  const svgRef = useRef();
  const targetTranslate = useSelector(
    (state) => state.boardState.targetTranslate
  );
  const turnToMove = useSelector((state) => state.boardState.turnToMove);
  const socket = useContext(SocketContext);
  const setTimer = useContext(SetTimerContext);

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
      setTimer(true, false, dispatch);
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
        setTimer(false, false, dispatch);
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
      setTimer(false, false, dispatch);
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

  useEffect(() => {
    const width = document.querySelector(".board-container").offsetWidth;
    dispatch({ type: "setBoardSize", value: [width, width / (521 / 577)] });
    dispatch({ type: "setBoard", value: constructNewBoard(width / 9) });

    window.ondragstart = () => false;
  }, []);

  useEffect(() => {
    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
    window.onresize = handleResize;
    socket.on("move", ([curRow, curCol], [newRow, newCol]) => {
      handleOpponentMove([curRow, curCol], [newRow, newCol]);
    });

    return () => {
      window.onmouseup = null;
      window.onmousemove = null;
      window.onresize = null;
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
