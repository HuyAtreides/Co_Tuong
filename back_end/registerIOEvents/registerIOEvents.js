const EventHandlers = require("../event_handlers/EventHandlers.js");
const USERDAO = require("../DAO/USERDAO");

const handleUseInviteLink = (io, socket) => {
  if (socket.opponentID) {
    const opponentSocket = io.sockets.get(socket.opponentID);
    if (opponentSocket && opponentSocket.useInviteLink) {
      if (EventHandlers.canJoinGame(socket, opponentSocket, true)) {
        const time = opponentSocket.time;
        socket.once("eventHandlersRegistered", () => {
          EventHandlers.handleFoundMatch(socket, opponentSocket, time);
        });
      }
    }
  }
};

function registerIOEvents(io) {
  const onConnectionHandler = async (socket) => {
    console.log(`${socket.id} connect`);

    EventHandlers.registerSetTimeAndSideHandlers(socket);
    EventHandlers.registerFindMatchHandlers(io.of("/play"), socket);
    EventHandlers.registerOpponentMoveHandlers(io.of("/play"), socket);
    EventHandlers.registerSendMessageHandlers(io.of("/play"), socket);
    EventHandlers.registerDisconnectHandlers(io.of("/play"), socket);
    EventHandlers.registerDrawOfferHandlers(io.of("/play"), socket);
    EventHandlers.registerGameFinishHandlers(io.of("/play"), socket);
    EventHandlers.registerPauseAndResumeGameHandlers(io.of("/play"), socket);
    EventHandlers.registerTimerHandlers(io.of("/play"), socket);
    EventHandlers.registerSendInviteHandlers(io.of("/play"), socket);
    handleUseInviteLink(io.of("/play"), socket);
  };

  io.of("/play").use(async (socket, next) => {
    socket.player = socket.handshake.auth.player;
    socket.opponentID = socket.handshake.auth.opponentID;
    const playername = socket.player.playername;
    socket.join(playername);
    const socketsInRoom = io.of("/play").adapter.rooms.get(playername);

    if (socketsInRoom.size >= 2) {
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
