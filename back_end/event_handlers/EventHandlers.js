const USERDAO = require("../DAO/USERDAO.js");

class EventHandlers {
  static intervalID;

  static declineAllInvites(io, socket, excludeID) {
    const rooms = socket.rooms;
    rooms.forEach((roomName) => {
      if (roomName !== socket.id) {
        const id = roomName.split("-")[1];
        if (excludeID === null || excludeID !== id) {
          socket.leave(roomName);
          io.to(id).emit("inviteDeclined", socket.player);
        }
      }
    });
  }

  static async cancelAllInvites(io, socket, excludeID) {
    const roomName = socket.player.playername + "-" + socket.id;
    const allSockets = await io.to(roomName).allSockets();
    allSockets.forEach((socketID) => {
      const receiverSocket = io.sockets.get(socketID);
      if (excludeID === null || socketID !== excludeID) {
        receiverSocket.leave(roomName);
        receiverSocket.emit("inviteCanceled", socket.player);
      }
    });
  }

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

  static async handleFoundMatch(socket, curSocket, time) {
    const [player1, player2] = [socket.player, curSocket.player];
    EventHandlers.assignFirstMove(socket, curSocket, curSocket.id);
    socket.emit("foundMatch", player2, socket.firstMove, time);
    curSocket.emit("foundMatch", player1, !socket.firstMove, time);
    await USERDAO.updateUserInGame(player1.playername, true);
    await USERDAO.updateUserInGame(player2.playername, true);
  }

  static canJoinGame(socket, curSocket) {
    return (
      curSocket.id !== socket.id &&
      curSocket.opponentID === null &&
      curSocket.player.playername !== socket.player.playername &&
      socket.connected &&
      curSocket.connected
    );
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
        } else if (!socket.connected) {
          socket.emit("connectionClosed");
          clearInterval(intervalID);
        } else {
          for (let [_, curSocket] of io.sockets) {
            if (EventHandlers.canJoinGame(socket, curSocket)) {
              await EventHandlers.handleFoundMatch(socket, curSocket, time);
              clearInterval(intervalID);
              return;
            }
          }
        }
      }, 1000);
    });
  }

  static registerSendInviteHandlers(io, socket) {
    socket.on("sendInvite", (receiverSocketID, time) => {
      const receiverSocket = io.sockets.get(receiverSocketID);
      if (receiverSocket.inGame)
        io.to(senderSocketID).emit("playerInGame", receiverSocket.playername);
      else if (receiverSocket.rooms.size - 1 === 5)
        io.to(senderSocketID).emit("invalidInvite", receiverSocket.playername);
      else {
        receiverSocket.join(socket.player.playername + "-" + socket.id);
        io.to(receiverSocketID).emit(
          "receiveInvite",
          socket.player,
          socket.id,
          time
        );
      }
    });

    socket.on("declineInvite", (senderSocketID, all) => {
      if (all) EventHandlers.declineAllInvites(io, socket, null);
      else {
        const senderSocket = io.sockets.get(senderSocketID);
        const receiverSocket = io.sockets.get(socket.id);
        const roomName = senderSocket.player.playername + "-" + senderSocketID;
        receiverSocket.leave(roomName);
        io.to(senderSocketID).emit("inviteDeclined", socket.player);
      }
    });

    socket.on("cancelInvite", async (receiverSocketID, all) => {
      if (all) {
        await EventHandlers.cancelAllInvites(io, socket, null);
      } else io.to(receiverSocketID).emit("inviteCanceled", socket.player);
    });

    socket.on("inviteReceived", (senderSocketID) => {
      io.to(senderSocketID).emit("validInvite");
    });

    socket.on("acceptInvite", async (senderSocketID, time) => {
      const senderSocket = io.sockets.get(senderSocketID);
      if (!senderSocket.inGame && !socket.inGame) {
        senderSocket.inGame = true;
        socket.inGame = true;
        EventHandlers.declineAllInvites(io, senderSocket, socket.id);
        EventHandlers.declineAllInvites(io, socket, senderSocketID);

        await EventHandlers.handleFoundMatch(socket, senderSocket, time);
      }
    });
  }

  static registerSendMessageHandlers(io, socket) {
    socket.on("sendMessage", (message) => {
      io.to(socket.opponentID).emit("incomingMessage", message);
    });
  }

  static registerDisconnectHandlers(io, socket) {
    socket.on("disconnect", async (reason) => {
      console.log(socket.id + " disconnect");
      if (reason === "server namespace disconnect") return;
      io.to(socket.opponentID).emit("opponentLeftGame");
      io.to(socket.opponentID).emit("gameOver", "Won", "Game Abandoned");
      await EventHandlers.cancelAllInvites(io, socket, null);
      if (socket.player.guest)
        await USERDAO.removeGuest(socket.player.playername);
      else {
        await USERDAO.updateUserInGame(socket.player.playername, false);
        await USERDAO.setSocketID(socket.player.playername, null, false);
      }
    });

    socket.on("exitGame", async () => {
      socket.inGame = undefined;
      io.to(socket.opponentID).emit("opponentLeftGame");
      socket.opponentID = undefined;
      await USERDAO.updateUserInGame(socket.player.playername, false);
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
