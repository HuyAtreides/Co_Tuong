const USERDAO = require("../DAO/USERDAO.js");

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
    socket.opponent = curSocket.player;
    curSocket.opponent = socket.player;
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
    socket.on("findMatch", async (side, time) => {
      const start = new Date();
      const user = await USERDAO.findUser(socket.player.playername);
      if (user.inGame) return socket.emit("isInGame");
      socket.opponentID = null;
      socket.side = side[1];
      const intervalID = setInterval(async () => {
        const timeElapse = (new Date() - start) / 1000;
        if (timeElapse > 10) {
          socket.emit("timeout");
          socket.opponentID = undefined;
          clearInterval(intervalID);
        } else if (socket.opponentID) {
          clearInterval(intervalID);
        } else {
          for (let [id, curSocket] of io.sockets) {
            if (
              id !== socket.id &&
              curSocket.opponentID === null &&
              curSocket.player.playername !== socket.player.playername
            ) {
              const [player1, player2] = [socket.player, curSocket.player];
              EventHandlers.assignFirstMove(socket, curSocket, id);
              await USERDAO.updateUserInGame(player1.playername, true);
              await USERDAO.updateUserInGame(player2.playername, true);
              socket.emit("foundMatch", player2, socket.firstMove, time);
              curSocket.emit("foundMatch", player1, !socket.firstMove, time);
              clearInterval(intervalID);
              return;
            }
          }
        }
      }, 1000);
    });
  }

  static registerSendInviteHandlers(io, socket) {
    socket.on("sendInvite", (receiverSocketID) => {
      const receiverSocket = io.sockets.get(receiverSocketID);
      receiverSocket.join(socket.player.playername);
    });
    socket.on("cancelInvite", (receiverSocketID) => {});
  }

  static registerSendMessageHandlers(io, socket) {
    socket.on("sendMessage", (message) => {
      io.to(socket.opponentID).emit("incomingMessage", message);
    });
  }

  static registerDisconnectHandlers(io, socket) {
    socket.on("disconnect", async () => {
      console.log(socket.id + " disconnect");
      io.to(socket.opponentID).emit("opponentLeftGame");
      io.to(socket.opponentID).emit("gameOver", "Won", "Game Abandoned");
      if (socket.player.guest)
        await USERDAO.removeGuest(socket.player.playername);
      else {
        await USERDAO.updateUserInGame(socket.player.playername, false);
        await USERDAO.setSocketID(socket.player.playername, null, false);
      }
    });

    socket.on("exitGame", async () => {
      io.to(socket.opponentID).emit("opponentLeftGame");
      socket.opponentID = undefined;
      await USERDAO.updateUserInGame(socket.player.playername, false);
    });
  }

  static registerLogoutHandlers(io, socket) {
    socket.on("logout", () => {
      socket.to(socket.sessionID).emit("accountLogout");
    });
  }

  static registerDrawOfferHandlers(io, socket) {
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
    socket.on("playerPauseGame", () => {
      io.to(socket.opponentID).emit("opponentPauseGame");
    });

    socket.on("pauseTimeout", () => {
      io.to(socket.opponentID).emit("pauseOver");
    });

    socket.on("startGame", () => {
      io.to(socket.opponentID).emit("gameStarted");
    });

    socket.on("playerResumeGame", () => {
      io.to(socket.opponentID).emit("opponentResumeGame");
    });
  }
}

module.exports = EventHandlers;
