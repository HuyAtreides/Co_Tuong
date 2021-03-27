const EventHandlers = require("../event_handlers/EventHandlers.js");
const USERDAO = require("../DAO/USERDAO");

function registerIOEvents(io) {
  const onConnectionHandler = (socket) => {
    console.log(`${socket.id} connect`);
    const socketID = socket.player.socketID;
    if (socketID) {
      const socket = io.of("/play").sockets.get(socketID);
      if (socket) {
        socket.emit("loginOnOtherPlace");
        socket.disconnect(true);
      }
    }

    EventHandlers.registerFindMatchHandlers(io.of("/play"), socket);
    EventHandlers.registerOpponentMoveHandlers(io.of("/play"), socket);
    EventHandlers.registerSendMessageHandlers(io.of("/play"), socket);
    EventHandlers.registerDisconnectHandlers(io.of("/play"), socket);
    EventHandlers.registerDrawOfferHandlers(io.of("/play"), socket);
    EventHandlers.registerGameFinishHandlers(io.of("/play"), socket);
    EventHandlers.registerPauseGameHandlers(io.of("/play"), socket);
    EventHandlers.registerTimerHandlers(io.of("/play"), socket);
    EventHandlers.registerSendInviteHandlers(io.of("/play"), socket);
    USERDAO.setSocketID(socket.player.playername, socket.id, true);
  };

  io.of("/play").use((socket, next) => {
    socket.player = socket.handshake.auth.player;
    next();
  });

  io.of("/play").on("connection", onConnectionHandler);
}

module.exports = registerIOEvents;
