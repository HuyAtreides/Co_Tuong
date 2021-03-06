const EventHandlers = require("../event_handlers/EventHandlers.js");

function registerIOEvents(io) {
  const onConnectionHandler = (socket) => {
    for (let [id, currentSocket] of io.of("/play").sockets) {
      console.log([id, currentSocket.opponentID]);
    }
    console.log(`${socket.id} connect`);

    EventHandlers.registerFindMatchHandlers(io.of("/play"), socket);
    EventHandlers.registerOpponentMoveHandlers(io.of("/play"), socket);
    EventHandlers.registerSendMessageHandlers(io.of("/play"), socket);
    EventHandlers.registerCheckMateHandlers(io.of("/play"), socket);
    EventHandlers.registerDisconnectHandlers(io.of("/play"), socket);
    EventHandlers.registerDrawHandlers(io.of("/play"), socket);
    EventHandlers.registerGameFinish(io.of("/play"), socket);
  };

  io.of("/play").on("connection", onConnectionHandler);
}

module.exports = registerIOEvents;
