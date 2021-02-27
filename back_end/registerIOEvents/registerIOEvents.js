const EventHandlers = require("../event_handlers/EventHandlers.js");

function registerIOEvents(io) {
  const onConnectionHandler = (socket) => {
    console.log(`${socket.id} connect`);

    EventHandlers.registerFindMatchHandlers(io.of("/play"), socket);
    EventHandlers.registerOpponentMoveHandlers(io.of("/play"), socket);

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnect`);
    });
  };

  io.of("/play").on("connection", onConnectionHandler);
}

module.exports = registerIOEvents;
