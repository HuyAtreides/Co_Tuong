class EventHandlers {
  static intervalID;

  static registerTimerHandlers(io, socket) {
    socket.on("startTimer", (start) => {
      clearInterval(EventHandlers.intervalID);
      if (start) {
        EventHandlers.intervalID = setInterval(() => {
          io.to(socket.id).to(socket.opponentID).emit("oneSecondPass");
        }, 1000);
      }
    });
  }

  static registerOpponentMoveHandlers(io, socket) {
    socket.on("opponentMove", (newPosition, [curRow, curCol]) => {
      const [_, newRow, newCol] = newPosition;
      const [symmetryCurRow, symmetryCurCol] = [9 - curRow, 8 - curCol];
      const [symmetryNewRow, symmetryNewCol] = [9 - newRow, 8 - newCol];
      io.to(socket.opponentID).emit(
        "move",
        [symmetryCurRow, symmetryCurCol],
        [symmetryNewRow, symmetryNewCol]
      );
    });
  }

  static assignFirstMove(socket, curSocket, id) {
    curSocket.opponentID = socket.id;
    socket.opponentID = id;
    if (socket.side !== curSocket.side) {
      socket.firstMove = socket.side === "red";
      curSocket.firstMove = curSocket.side === "red";
    } else {
      const firstMove = Math.floor(Math.random() * 2);
      socket.firstMove = firstMove === 1;
      curSocket.firstMove = firstMove !== 1;
    }
  }

  static registerFindMatchHandlers(io, socket) {
    socket.on("findMatch", (side, time) => {
      const start = new Date();
      socket.opponentID = null;
      socket.side = side[1];
      const intervalID = setInterval(() => {
        const timeElapse = (new Date() - start) / 1000;
        if (timeElapse > 10) {
          socket.emit("timeout");
          socket.opponentID = undefined;
          clearInterval(intervalID);
        } else if (socket.opponentID) {
          clearInterval(intervalID);
        } else {
          for (let [id, curSocket] of io.sockets) {
            if (id !== socket.id && curSocket.opponentID === null) {
              EventHandlers.assignFirstMove(socket, curSocket, id);
              socket.emit("foundMatch", id, socket.firstMove, time);
              curSocket.emit("foundMatch", socket.id, !socket.firstMove, time);
              clearInterval(intervalID);
              return;
            }
          }
        }
      }, 1000);
    });
  }

  static registerSendMessageHandlers(io, socket) {
    socket.on("sendMessage", (message) => {
      io.to(socket.opponentID).emit("incomingMessage", message);
    });
  }

  static registerCheckMateHandlers(io, socket) {
    socket.on("checkmate", () => {
      io.to(socket.opponentID).emit("won");
    });
  }

  static registerDisconnectHandlers(io, socket) {
    socket.on("disconnect", () => {
      console.log(socket.id + " disconnect");
      io.to(socket.opponentID).emit("gameOver", "Won", "Game Abandoned");
    });

    socket.on("exitGame", () => {
      socket.opponentID = undefined;
    });
  }

  static registerDrawHandlers(io, socket) {
    socket.on("sendDrawOffer", () => {
      io.to(socket.opponentID).emit("receiveDrawOffer");
    });
  }

  static registerGameFinishHandlers(io, socket) {
    socket.on("gameFinish", (gameResult) => {
      if (gameResult !== "Draw") {
        const [result, reason] = gameResult;
        io.to(socket.opponentID).emit("gameOver", result, reason);
      } else io.to(socket.opponentID).emit("draw", gameResult, null);
    });
  }

  static registerPauseGameHandlers(io, socket) {
    socket.on("pauseGame", () => {
      io.to(socket.opponentID).emit("gamePaused");
    });

    socket.on("pauseTimeout", () => {
      io.to(socket.opponentID).emit("pauseOver");
    });

    socket.on("resumeGame", () => {
      io.to(socket.opponentID).emit("gameResumed");
    });

    socket.on("playerResumeGame", () => {
      io.to(socket.opponentID).emit("opponentResumeGame");
    });
  }
}

module.exports = EventHandlers;
