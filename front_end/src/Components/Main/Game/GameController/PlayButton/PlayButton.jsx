import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import React from "react";

const PlayButton = ({ findingMatch, lang, handlePlay }) => {
  if (findingMatch === true) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip id="play-button-tooltip">
            {lang === "English" ? "Click To Cancel" : "Nhấp Để Hủy"}
          </Tooltip>
        }
      >
        <Button className="play finding-opponent" onClick={handlePlay}>
          {lang === "English" ? "Finding Opponent..." : "Tìm Trận..."}
        </Button>
      </OverlayTrigger>
    );
  }
  return (
    <Button className="play" onClick={handlePlay}>
      {findingMatch}
    </Button>
  );
};

export default PlayButton;
