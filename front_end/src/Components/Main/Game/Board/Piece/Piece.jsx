import React from "react";

const appendPiece = ({ board, handleMouseDown }, pieces, choosenSide) => {
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] && board[i][j].side === choosenSide) {
        const [row, col] = board[i][j].position;
        pieces.push(
          <image
            id={`p${row}${col}`}
            href={`/images/Pieces/${board[i][j].name}.png`}
            width={board[i][j].width - 3}
            height={board[i][j].width - 3}
            style={{ opacity: board[i][j].canBeCaptured ? "0.6" : "1" }}
            transform={board[i][j].translate}
            key={`piece${i}${j}`}
            onMouseDown={handleMouseDown}
          ></image>
        );
      }
    }
  }
};

function Piece(props) {
  const pieces = [];
  const side = props.side;
  appendPiece(props, pieces, side[0]);
  appendPiece(props, pieces, side[1]);

  return <>{pieces}</>;
}

export default Piece;
