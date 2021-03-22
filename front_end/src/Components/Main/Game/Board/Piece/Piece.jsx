import React from "react";

function Piece(props) {
  const pieces = [];
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 9; j++) {
      if (props.board[i][j]) {
        const [row, col] = props.board[i][j].position;
        pieces.push(
          <image
            id={`p${row}${col}`}
            href={`/images/Pieces/${props.board[i][j].name}.png`}
            width={props.board[i][j].width - 3}
            height={props.board[i][j].width - 3}
            transform={props.board[i][j].translate}
            key={`${i}${j}`}
            onMouseDown={props.handleMouseDown}
          ></image>
        );
      }
    }
  }

  return <g>{pieces}</g>;
}

export default Piece;
