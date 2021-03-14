const cors = require("cors");
const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const httpServer = require("http").createServer(app);
const registerIOEvents = require("./registerIOEvents/registerIOEvents.js");
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const loginRoute = require("./routes/loginRoute.js");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: 172800000,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/login", loginRoute);

registerIOEvents(io);

module.exports = httpServer;
