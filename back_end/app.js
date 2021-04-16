const cors = require("cors");
const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const httpServer = require("http").createServer(app);
const registerIOEvents = require("./registerIOEvents/registerIOEvents.js");
const api = require("./routes/api/api.js");
const USERDAO = require("./DAO/USERDAO.js");
const path = require("path");
const uploadsRoutes = require("./routes/uploadsRoute.js");
const sessionMiddleware = session({
  secret: "co_tuong",
  cookie: {
    maxAge: 259200000,
    sameSite: "lax",
  },
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
});
const io = require("socket.io")(httpServer);

app.use(express.static(__dirname + "/build"));

registerIOEvents(io);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());

app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  const user = await USERDAO.findUser(username);
  return done(null, user);
});

app.use("/api", api);
app.use("/uploads", uploadsRoutes);
app.use((_, res) => {
  return res.sendFile(path.join(__dirname + "/build/index.html"));
});

module.exports = httpServer;
