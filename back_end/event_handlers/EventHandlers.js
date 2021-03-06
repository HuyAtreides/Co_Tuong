class EventHandlers {
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

  static assignFirstMove(socket, currentSocket, id) {
    currentSocket.opponentID = socket.id;
    socket.opponentID = id;
    if (socket.side !== currentSocket.side) {
      socket.firstMove = socket.side === "red";
      currentSocket.firstMove = currentSocket.side === "red";
    } else {
      const firstMove = Math.floor(Math.random() * 2);
      socket.firstMove = firstMove === 1;
      currentSocket.firstMove = firstMove !== 1;
    }
  }

  static registerFindMatchHandlers(io, socket) {
    socket.on("findMatch", (side) => {
      const start = new Date();
      socket.opponentID = null;
      socket.side = side[1];
      const intervalID = setInterval(() => {
        const timeElapse = (new Date() - start) / 1000;
        if (timeElapse > 10) {
          socket.emit("timeout");
          clearInterval(intervalID);
        } else if (socket.opponentID) {
          socket.emit("foundMatch", socket.opponentID, socket.firstMove);
          clearInterval(intervalID);
        } else {
          for (let [id, currentSocket] of io.sockets) {
            if (id !== socket.id && currentSocket.opponentID === null) {
              EventHandlers.assignFirstMove(socket, currentSocket, id);
              socket.emit("foundMatch", id, socket.firstMove);
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
      console.log(socket.opponentID + "disconnect");
      io.to(socket.opponentID).emit("won");
    });
  }

  static registerDrawHandlers(io, socket) {
    socket.on("sendDrawOffer", () => {
      io.to(socket.opponentID).emit("receiveDrawOffer");
    });

    socket.on("declineDrawOffer", () => {
      io.to(socket.opponentID).emit("decline");
    });

    socket.on("acceptDrawOffer", () => {
      io.to(socket.opponentID).emit("accept");
    });
  }

  static registerGameFinish(io, socket) {
    socket.on("gameFinish", (gameResult) => {
      io.to(socket.opponentID).emit("draw", gameResult);
    });
  }
}

module.exports = EventHandlers;
