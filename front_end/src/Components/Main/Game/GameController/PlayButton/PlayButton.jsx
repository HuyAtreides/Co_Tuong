import { Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import React from "react";

const renderTooltip = (props) => (
  <Tooltip id="play-button-tooltip" {...props}>
    Click To Cancel
  </Tooltip>
);

const PlayButton = (props) => {
  if (props.findingMatch === true) {
    return (
      <OverlayTrigger placement="top" overlay={renderTooltip}>
        <Button className="play finding-opponent" onClick={props.handlePlay}>
          Finding Opponent...
        </Button>
      </OverlayTrigger>
    );
  }
  return (
    <Button className="play" onClick={props.handlePlay}>
      {props.findingMatch}
    </Button>
  );
};

export default PlayButton;
