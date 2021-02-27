const cors = require("cors");
const express = require("express");
const app = express();
const httpServer = require("http").createServer(app);
const registerIOEvents = require("./registerIOEvents/registerIOEvents.js");
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
registerIOEvents(io);

httpServer.listen(8080, () => {
  console.log("listening at port 8080");
});
