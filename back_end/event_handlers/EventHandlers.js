class EventHandlers {
  static registerOpponentMoveHandlers(io, socket) {
    socket.on("opponentMove", (newPosition, [curRow, curCol]) => {
      const [_, newRow, newCol] = newPosition;
      const [symmetryCurRow, symmetryCurCol] = [9 - curRow, 8 - curCol];
      const [symmetryNewRow, symmetryNewCol] = [9 - newRow, 8 - newCol];
      io.to(socket.opponent).emit(
        "move",
        [symmetryCurRow, symmetryCurCol],
        [symmetryNewRow, symmetryNewCol]
      );
    });
  }

  static registerFindMatchHandlers(io, socket) {
    socket.on("findMatch", () => {
      const start = new Date();
      socket.opponent = null;
      const intervalId = setInterval(() => {
        const timeElapse = (new Date() - start) / 1000;
        if (timeElapse > 10) {
          socket.emit("timeout");
          clearInterval(intervalId);
        } else if (socket.opponent) {
          socket.emit("foundMatch", socket.opponent, socket.firstMove);
          clearInterval(intervalId);
        } else {
          for (let [id, currentSocket] of io.sockets) {
            if (id !== socket.id && currentSocket.opponent === null) {
              currentSocket.opponent = socket.id;
              socket.opponent = id;
              const firstMove = Math.floor(Math.random() * 2);
              socket.firstMove = firstMove === 1;
              currentSocket.firstMove = firstMove !== 1;
              socket.emit("foundMatch", id, firstMove === 1);
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
