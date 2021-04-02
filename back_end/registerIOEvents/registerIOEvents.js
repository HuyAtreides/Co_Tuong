const EventHandlers = require("../event_handlers/EventHandlers.js");
const USERDAO = require("../DAO/USERDAO");

function registerIOEvents(io) {
  const onConnectionHandler = async (socket) => {
    console.log(`${socket.id} connect`);

    EventHandlers.registerFindMatchHandlers(io.of("/play"), socket);
    EventHandlers.registerOpponentMoveHandlers(io.of("/play"), socket);
    EventHandlers.registerSendMessageHandlers(io.of("/play"), socket);
    EventHandlers.registerDisconnectHandlers(io.of("/play"), socket);
    EventHandlers.registerDrawOfferHandlers(io.of("/play"), socket);
    EventHandlers.registerGameFinishHandlers(io.of("/play"), socket);
    EventHandlers.registerPauseGameHandlers(io.of("/play"), socket);
    EventHandlers.registerTimerHandlers(io.of("/play"), socket);
    EventHandlers.registerSendInviteHandlers(io.of("/play"), socket);
  };

  io.of("/play").use(async (socket, next) => {
    socket.player = socket.handshake.auth.player;
    const playername = socket.player.playername;
    socket.join(playername);
    const rooms = await io.of("/play").to(playername).allSockets();
    if (rooms.size === 2) {
      socket.leave(playername);
      return next(
        new Error(
          "This connection was closed because your account was logged in on another browser or device."
        )
      );
    }
    await USERDAO.setSocketID(socket.player.playername, socket.id, true);
    next();
  });

  io.of("/play").on("connection", onConnectionHandler);
}

module.exports = registerIOEvents;
