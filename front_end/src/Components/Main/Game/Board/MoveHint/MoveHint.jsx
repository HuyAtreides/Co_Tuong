import React from "react";

const MoveHint = ({ board, boardWidth }) => {
  const moveHints = [];
  const canCaptureHints = [];
  const radius = boardWidth / 18;
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === false) {
        moveHints.push(
          <circle
            cx={radius + j * (boardWidth / 9)}
            cy={radius + i * (boardWidth / 9)}
            key={`move-hint-${moveHints.length}`}
            r={radius / 2}
          ></circle>
        );
      } else if (board[i][j] && board[i][j].canBeCaptured) {
        canCaptureHints.push(
          <image
            href="/images/Legal_Capture_Icon/legal_capture.png"
            key={`capture-hint-${canCaptureHints.length}`}
            transform={board[i][j].translate}
            width={board[i][j].width - 3}
            height={board[i][j].width - 3}
          ></image>
        );
      }
    }
  }

  return (
    <>
      {moveHints}
      {canCaptureHints}
    </>
  );
};

export default MoveHint;
