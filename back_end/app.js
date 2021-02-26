const cors = require("cors");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const EventHandlers = require("./event_handlers/EventHandlers.js");

const onConnectionHandler = (socket) => {
  console.log(`${socket.id} connect`);

  EventHandlers.registerFindMatchHandlers(io.of("/play"), socket);
  EventHandlers.registerOpponentMoveHandlers(io.of("/play"), socket);

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnect`);
  });
};

app.use(cors());
io.of("/play").on("connection", onConnectionHandler);

httpServer.listen(8080, () => {
  console.log("listening at port 8080");
});
