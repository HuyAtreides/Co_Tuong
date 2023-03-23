const USERDAO = require('../DAO/USERDAO.js');

class EventHandlers {
  static intervalID;

  static registerSetTimeAndSideHandlers(socket) {
    socket.on('setTimeAndSide', (time, side, callback) => {
      socket.time = time;
      socket.side = side;
      if (callback) callback();
    });
  }

  static declineAllInvites(io, socket, excludeID) {
    if (socket.inviteSenders !== undefined) {
      socket.inviteSenders.forEach((senderID) => {
        const senderSocket = io.sockets.get(senderID);
        if (senderSocket && (excludeID === null || excludeID !== senderID)) {
          const index = senderSocket.sentInvites.indexOf(socket.id);
          senderSocket.sentInvites.splice(index, 1);
          io.to(senderID).emit('inviteDeclined', socket.player);
        }
      });
      socket.inviteSenders = [];
    }
  }

  static cancelAllInvites(io, socket, excludeID) {
    if (socket.sentInvites !== undefined) {
      socket.sentInvites.forEach((socketID) => {
        const receiverSocket = io.sockets.get(socketID);
        if (receiverSocket && (excludeID === null || socketID !== excludeID)) {
          const index = receiverSocket.inviteSenders.indexOf(socket.id);
          receiverSocket.inviteSenders.splice(index, 1);
          receiverSocket.emit('inviteCanceled', socket.player);
        }
      });
      socket.sentInvites = [];
    }
  }

  static registerTimerHandlers(io, socket) {
    socket.on('startTimer', (start) => {
      clearInterval(EventHandlers.intervalID);
      if (start) {
        EventHandlers.intervalID = setInterval(() => {
          if (io.sockets.size === 0) clearInterval(EventHandlers.intervalID);
          else io.emit('oneSecondPass');
        }, 1000);
      }
    });
  }

  static registerOpponentMoveHandlers(io, socket) {
    socket.on('opponentMove', (newPosition, [curRow, curCol]) => {
      const [_, newRow, newCol] = newPosition;
      const [symmetryCurRow, symmetryCurCol] = [9 - curRow, 8 - curCol];
      const [symmetryNewRow, symmetryNewCol] = [9 - newRow, 8 - newCol];
      io.to(socket.opponentID).emit(
        'move',
        [symmetryCurRow, symmetryCurCol],
        [symmetryNewRow, symmetryNewCol],
      );
    });

    socket.on('finishMove', () => {
      io.to(socket.id).to(socket.opponentID).emit('setTimer');
    });
  }

  static assignFirstMove(socket, curSocket, id) {
    curSocket.opponentID = socket.id;
    socket.opponent = curSocket.player;
    curSocket.opponent = socket.player;
    socket.opponentID = id;
    if (socket.side !== curSocket.side) {
      socket.firstMove = socket.side === 'red';
      curSocket.firstMove = curSocket.side === 'red';
    } else {
      const firstMove = Math.floor(Math.random() * 2);
      socket.firstMove = firstMove === 1;
      curSocket.firstMove = firstMove !== 1;
    }
  }

  static handleFoundMatch(socket, curSocket, time) {
    socket.useInviteLink = undefined;
    curSocket.useInviteLink = undefined;
    socket.gameFinished = false;
    curSocket.gameFinished = false;
    curSocket.time = time;
    socket.time = time;
    const [player1, player2] = [socket.player, curSocket.player];
    EventHandlers.assignFirstMove(socket, curSocket, curSocket.id);
    socket.emit('foundMatch', player2, socket.firstMove, time);
    curSocket.emit('foundMatch', player1, !socket.firstMove, time);
    socket.emit('clearInvites');
    curSocket.emit('clearInvites');
  }

  static canJoinGame(socket, curSocket, useInviteLink) {
    return (
      curSocket.id !== socket.id &&
      (socket.opponentID === null || useInviteLink) &&
      (curSocket.opponentID === null || useInviteLink) &&
      curSocket.player.playername !== socket.player.playername &&
      socket.connected &&
      curSocket.connected
    );
  }

  static findMatch(io, socket) {
    if (socket.opponentID) {
      return true;
    } else if (!socket.connected) {
      socket.opponentID = undefined;
      return true;
    } else {
      for (let [_, curSocket] of io.sockets) {
        if (EventHandlers.canJoinGame(socket, curSocket)) {
          EventHandlers.cancelAllInvites(io, socket, null);
          EventHandlers.cancelAllInvites(io, curSocket, null);
          EventHandlers.declineAllInvites(io, curSocket, socket.id);
          EventHandlers.declineAllInvites(io, socket, curSocket.id);
          EventHandlers.handleFoundMatch(socket, curSocket, socket.time);
          return true;
        }
      }
    }
  }

  static registerFindMatchHandlers(io, socket) {
    socket.on('findMatch', async () => {
      socket.opponentID = null;
      let intervalID;
      socket.removeAllListeners('cancelFindMatch');

      socket.on('cancelFindMatch', () => {
        if (!socket.opponentID) {
          socket.opponentID = undefined;
          clearInterval(intervalID);
          socket.emit('findMatchCanceled');
        }
      });

      if (socket.opponentID === null) {
        intervalID = setInterval(() => {
          const finish = EventHandlers.findMatch(io, socket);
          if (finish) {
            socket.removeAllListeners('cancelFindMatch');
            clearInterval(intervalID);
          }
        }, 1000);
      }
    });
  }

  static registerSendInviteHandlers(io, socket) {
    const canSendInvite = (receiverSocket, playername) => {
      if (!receiverSocket) {
        const message = `${playername} may be disconnected`;
        socket.emit('invalidInvite', message);
        return false;
      } else if (receiverSocket.opponentID || receiverSocket.opponentID === null) {
        const message = `${playername} is in a game`;
        socket.emit('invalidInvite', message);
        return false;
      } else if (
        receiverSocket.inviteSenders &&
        receiverSocket.inviteSenders.length >= 5
      ) {
        const message = `${playername} has received too many invites`;
        socket.emit('invalidInvite', message);
        return false;
      }
      return true;
    };

    socket.on('sendInvite', (receiverSocketID, playername) => {
      try {
        const receiverSocket = io.sockets.get(receiverSocketID);
        if (canSendInvite(receiverSocket, playername)) {
          if (!receiverSocket.inviteSenders) receiverSocket.inviteSenders = [];
          if (!socket.sentInvites) socket.sentInvites = [];
          socket.sentInvites.push(receiverSocketID);
          receiverSocket.inviteSenders.push(socket.id);
          io.to(receiverSocketID).emit(
            'receiveInvite',
            socket.player,
            socket.id,
            socket.time,
          );
        }
      } catch (err) {
        console.log(err.toString());
      }
    });

    socket.on('declineInvite', (senderSocketID, all) => {
      try {
        if (all) EventHandlers.declineAllInvites(io, socket, null);
        else {
          let index = socket.inviteSenders.indexOf(senderSocketID);
          socket.inviteSenders.splice(index, 1);
          const senderSocket = io.sockets.get(senderSocketID);
          if (!senderSocket) return;
          index = senderSocket.sentInvites.indexOf(socket.id);
          senderSocket.sentInvites.splice(index, 1);
          io.to(senderSocketID).emit('inviteDeclined', socket.player);
        }
      } catch (err) {
        console.log(err.toString());
      }
    });

    socket.on('cancelInvite', (receiverSocketID, all) => {
      if (all) {
        EventHandlers.cancelAllInvites(io, socket, null);
      } else {
        const receiverSocket = io.sockets.get(receiverSocketID);
        if (!receiverSocket) return;
        let index = receiverSocket.inviteSenders.indexOf(socket.id);
        receiverSocket.inviteSenders.splice(index, 1);
        index = socket.sentInvites.indexOf(receiverSocketID);
        socket.sentInvites.splice(index, 1);
        io.to(receiverSocketID).emit('inviteCanceled', socket.player);
      }
    });

    socket.on('inviteReceived', (senderSocketID) => {
      io.to(senderSocketID).emit('validInvite');
    });

    socket.on('acceptInvite', (senderSocketID) => {
      try {
        const senderSocket = io.sockets.get(senderSocketID);
        if (
          senderSocket &&
          senderSocket.opponentID === undefined &&
          socket.opponentID === undefined
        ) {
          const time = senderSocket.time;
          EventHandlers.cancelAllInvites(io, socket, null);
          EventHandlers.cancelAllInvites(io, senderSocket, null);
          EventHandlers.declineAllInvites(io, senderSocket, socket.id);
          EventHandlers.declineAllInvites(io, socket, senderSocketID);
          EventHandlers.handleFoundMatch(senderSocket, socket, time);
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('generateInviteLink', (callback) => {
      socket.useInviteLink = true;
      const url = `${process.env.BASE_URL}/api/play-with-friend/` + socket.id;
      callback(url);
    });
  }

  static registerSendMessageHandlers(io, socket) {
    socket.on('sendMessage', (message) => {
      io.to(socket.opponentID).emit('incomingMessage', message);
    });
  }

  static registerDisconnectHandlers(io, socket) {
    const handleGameFinish = () => {
      const opponentSocket = io.sockets.get(socket.opponentID);
      if (socket.opponentID && !socket.gameFinished) {
        socket.gameFinished = true;
        io.to(socket.opponentID).emit('gameOver', 'Won', 'Game Abandoned');
        USERDAO.updateMatchHistory(socket, 'Lost', 'Game Abandoned');
      }
      if (opponentSocket && !opponentSocket.gameFinished) {
        USERDAO.updateMatchHistory(opponentSocket, 'Won', 'Game Abandoned');
        opponentSocket.gameFinished = true;
      }
    };

    socket.on('disconnect', (reason) => {
      if (reason !== 'ping timeout') return;
      if (socket.player.guest) USERDAO.removeGuest(socket.player.playername);
      else {
        USERDAO.setSocketID(socket.player.playername, null, false);
      }
      handleGameFinish();
      EventHandlers.declineAllInvites(io, socket, null);
      EventHandlers.cancelAllInvites(io, socket, null);
      io.to(socket.opponentID).emit('opponentLeftGame');
    });

    socket.on('exitGame', async () => {
      io.to(socket.opponentID).emit('opponentLeftGame');
      socket.opponentID = undefined;
    });
  }

  static registerDrawOfferHandlers(io, socket) {
    socket.on('sendDrawOffer', () => {
      io.to(socket.opponentID).emit('receiveDrawOffer');
    });
  }

  static registerGameFinishHandlers(io, socket) {
    socket.on('gameFinish', (gameResult) => {
      const opponentSocket = io.sockets.get(socket.opponentID);
      let [result, reason] = ['Draw', 'Game Draw By Agreement'];
      if (!socket.gameFinished) {
        socket.gameFinished = true;
        if (gameResult !== 'Draw') {
          [result, reason] = gameResult;
          io.to(socket.opponentID).emit('gameOver', result, reason);
        } else io.to(socket.opponentID).emit('draw', result, null);
        const matchResult =
          result === 'Draw' ? result : result === 'Won' ? 'Lost' : 'Won';
        USERDAO.updateMatchHistory(socket, matchResult, reason);
      }
      if (opponentSocket && !opponentSocket.gameFinished) {
        opponentSocket.gameFinished = true;
        USERDAO.updateMatchHistory(opponentSocket, result, reason);
      }
    });
  }

  static registerPauseAndResumeGameHandlers(io, socket) {
    socket.on('playerPauseGame', () => {
      io.to(socket.opponentID).emit('opponentPauseGame');
    });

    socket.on('playerResumeGame', () => {
      io.to(socket.opponentID).emit('opponentResumeGame');
    });

    socket.on('receivePauseSignalAck', () => {
      io.to(socket.opponentID).to(socket.id).emit('startPauseTimer', false);
    });

    socket.on('receiveResumeSignalAck', () => {
      io.to(socket.opponentID).to(socket.id).emit('startPauseTimer', true);
    });

    socket.on('startGame', () => {
      io.to(socket.opponentID).emit('receiveGameStartSignal');
    });

    socket.on('receiveGameStartSignalAck', () => {
      io.to(socket.opponentID).to(socket.id).emit('gameStarted');
    });
  }
}

module.exports = EventHandlers;
