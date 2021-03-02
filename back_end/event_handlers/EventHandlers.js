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

  static handleAssignFirstMove(socket, currentSocket, id) {
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
    socket.emit("foundMatch", id, socket.firstMove);
  }

  static registerFindMatchHandlers(io, socket) {
    socket.on("findMatch", (side) => {
      const start = new Date();
      socket.opponentID = null;
      socket.side = side[1];
      const intervalId = setInterval(() => {
        const timeElapse = (new Date() - start) / 1000;
        if (timeElapse > 10) {
          socket.emit("timeout");
          clearInterval(intervalId);
        } else if (socket.opponentID) {
          socket.emit("foundMatch", socket.opponentID, socket.firstMove);
          clearInterval(intervalId);
        } else {
          for (let [id, currentSocket] of io.sockets) {
            if (id !== socket.id && currentSocket.opponentID === null) {
              EventHandlers.handleAssignFirstMove(socket, currentSocket, id);
              socket.emit("foundMatch", id, socket.firstMove);
              clearInterval(intervalId);
              return;
            }
          }
        }
      }, 1000);
    });
  }
}

module.exports = EventHandlers;
