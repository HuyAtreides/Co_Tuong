import React from "react";

function Piece({ board, handleMouseDown }) {
  const pieces = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j]) {
        const [row, col] = board[i][j].position;
        pieces.push(
          <image
            id={`p${row}${col}`}
            href={`/images/Pieces/${board[i][j].name}.png`}
            width={board[i][j].width - 3}
            height={board[i][j].width - 3}
            transform={board[i][j].translate}
            key={`${i}${j}`}
            onMouseDown={handleMouseDown}
          ></image>
        );
      }
    }
  }

  return <g>{pieces}</g>;
}

export default Piece;
