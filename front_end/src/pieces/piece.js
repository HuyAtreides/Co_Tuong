class Piece {
  constructor(width, row, col, name, choosenSide) {
    this.width = width;
    this.position = [row, col];
    this.name = name;
    this.side = name.split("-")[1];
    this.choosenSide = choosenSide;
    this.minCol = 0;
    this.maxCol = 8;
    this.minRow = 0;
    this.maxRow = 9;
    this.translate = `translate(${width * col}, ${width * row})`;
  }

  move(x, y) {
    const translate = `translate(${x - this.width / 2}, ${y - this.width / 2})`;
    this.translate = translate;
  }

  checkValidMove(newRow, newCol, board) {
    const [curRow, curCol] = this.position;
    const [moveRow, moveCol] = [newRow - curRow, newCol - curCol];
    const valid =
      newCol >= this.minCol &&
      newCol <= this.maxCol &&
      newRow >= this.minRow &&
      newRow <= this.maxRow;
    const existMove = this.moves.some((move) => {
      return move[0] === moveRow && move[1] === moveCol;
    });
    if (valid && existMove) {
      const generalTranslate = this.putGeneralInDanger(newRow, newCol, board);
      if (generalTranslate) return generalTranslate;
      return true;
    }
    return false;
  }

  setPosition(capture, newRow, newCol) {
    const [translateX, translateY] = [newCol * this.width, newRow * this.width];
    const translate = `translate(${translateX}, ${translateY})`;
    this.position = [newRow, newCol];
    this.translate = translate;
    return [capture === "capture", newRow, newCol];
  }

  canMoveToNewPosition(newRow, newCol, board) {
    const [curRow, curCol] = this.position;
    const [translateX, translateY] = [curCol * this.width, curRow * this.width];
    this.translate = `translate(${translateX}, ${translateY})`;
    if (this.side === this.choosenSide[1]) {
      const isValid = this.checkValidMove(newRow, newCol, board);
      if (isValid && !/translate/.test(isValid)) {
        if (!board[newRow][newCol].side) {
          if (this.countPiecesBetween(newRow, newCol, board) === 0) return true;
        } else if (board[newRow][newCol].side !== board[curRow][curCol].side)
          if (this.countPiecesBetween(newRow, newCol, board) === 1)
            return "capture";
      } else if (isValid) return isValid;
    }
    return false;
  }

  countPiecesBetween(newRow, newCol, board) {
    let [curRow, curCol] = this.position;
    let count = 0;
    if (newRow === curRow) {
      do {
        curCol += curCol > newCol ? -1 : 1;
        if (board[curRow][curCol]) count++;
      } while (curCol !== newCol);
    } else {
      do {
        curRow += curRow > newRow ? -1 : 1;
        if (board[curRow][curCol]) count++;
      } while (curRow !== newRow);
    }
    return count;
  }

  static isGeneralInDanger(board, side) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] && board[i][j].side !== side) {
          const canCapture = board[i][j].canCaptureGeneral(board);
          if (/translate/.test(canCapture)) return canCapture;
        }
      }
    }
    return false;
  }

  putGeneralInDanger(newRow, newCol, board) {
    const tmpBoard = board.reduce((acc, row) => {
      acc.push([...row]);
      return acc;
    }, []);
    this.updateTmpBoard(newRow, newCol, tmpBoard);
    return Piece.isGeneralInDanger(tmpBoard, this.side);
  }

  static isLost(board, side) {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] && board[i][j].side === side) {
          const [curRow, curCol] = board[i][j].position;
          for (let move of board[i][j].moves) {
            const [newRow, newCol] = [curRow + move[0], curCol + move[1]];
            const tmp = board[i][j].canMoveToNewPosition(newRow, newCol, board);
            if (tmp && !/translate/.test(tmp)) return null;
          }
        }
      }
    }
    if (Piece.isGeneralInDanger(board, side)) {
      return "Checkmate";
    }
    return "Stalemate";
  }

  updateTmpBoard(newRow, newCol, tmpBoard) {
    const [curRow, curCol] = this.position;
    const tmp = tmpBoard[curRow][curCol];
    tmpBoard[curRow][curCol] = 0;
    tmpBoard[newRow][newCol] = tmp;
  }

  canCaptureGeneral(tmpBoard) {
    const [curRow, curCol] = this.position;
    for (let move of this.moves) {
      const [newRow, newCol] = [curRow + move[0], curCol + move[1]];
      if (newCol >= 0 && newCol < 9 && newRow >= 0 && newRow < 10) {
        if (tmpBoard[newRow][newCol].side)
          if (tmpBoard[newRow][newCol].side !== tmpBoard[curRow][curCol].side)
            if (this.countPiecesBetween(newRow, newCol, tmpBoard) === 1)
              if (tmpBoard[newRow][newCol].name.split("-")[0] === "general") {
                return tmpBoard[newRow][newCol].translate;
              }
      }
    }
    return false;
  }

  modifyBoard(board, [newRow, newCol], dispatch) {
    const [curRow, curCol] = this.position;
    this.setPosition(null, newRow, newCol);
    const tmp = board[curRow][curCol];
    if (board[newRow][newCol])
      dispatch({ type: "setCapturedPieces", value: board[newRow][newCol] });
    board[curRow][curCol] = 0;
    board[newRow][newCol] = tmp;
    dispatch({ type: "setTurnToMove", value: true });
    dispatch({ type: "setBoard", value: [...board] });
  }

  animateMove([newRow, newCol], board, dispatch) {
    const [curRow, curCol] = this.position;
    this.DOMNode = document.querySelector(`#p${curRow}${curCol}`);
    if (curCol === newCol) {
      this.moveVertical([newRow, newCol], board, dispatch);
    } else this.moveDiagonal([newRow, newCol], board, dispatch);
  }

  setTransform([xB, yB], board, dispatch) {
    const translate = `translate(${xB * this.width}, ${yB * this.width})`;
    this.DOMNode.setAttribute("transform", translate);
    if (board) {
      this.modifyBoard(board, [yB, xB], dispatch);
    }
  }

  moveVertical([yB, xB], board, dispatch) {
    const [yA, xA] = this.position;
    let step = 0;

    const animate = () => {
      if (Math.abs(step) < Math.abs(yB - yA)) {
        step += (yB - yA) / (0.25 * 60);
        this.setTransform([xA, yA + step], null, null);
        window.requestAnimationFrame(animate);
      } else if (Math.abs(step) >= Math.abs(yB - yA)) {
        this.setTransform([xB, yB], board, dispatch);
      }
    };

    window.requestAnimationFrame(animate);
  }

  moveDiagonal([yB, xB], board, dispatch) {
    const [yA, xA] = this.position;
    let step = 0;

    const animate = () => {
      if (Math.abs(step) < Math.abs(xB - xA)) {
        step += (xB - xA) / (0.25 * 60);
        let y = (step / (xB - xA)) * (yB - yA) + yA;
        this.setTransform([xA + step, y], null, null);
        window.requestAnimationFrame(animate);
      } else if (Math.abs(step) >= Math.abs(xB - xA)) {
        this.setTransform([xB, yB], board, dispatch);
      }
    };

    window.requestAnimationFrame(animate);
  }
}

export default Piece;
