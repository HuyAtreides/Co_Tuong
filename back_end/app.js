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
const signupRoute = require("./route/signupRoute.js");

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: "co_tuong",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  if (req.session.failedLoginCount === undefined) {
    req.session.failedLoginCount = 0;
  }
  if (req.session.failedVerifyEmailCount === undefined) {
    req.session.failedVerifyEmailCount = 0;
  }
  next();
});
passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  const user = await USERDAO.findUser(username);
  done(null, user);
});

app.use("/login", loginRoute);
app.use("/signup", signupRoute);

registerIOEvents(io);

module.exports = httpServer;
