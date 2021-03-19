const cors = require("cors");
const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const httpServer = require("http").createServer(app);
const registerIOEvents = require("./registerIOEvents/registerIOEvents.js");
const loginRoute = require("./routes/loginRoute.js");
const signupRoute = require("./routes/signupRoute.js");
const verifyEmailRoute = require("./routes/verifyEmailRoute.js");
const entryRoute = require("./routes/entryRoute.js");
const logoutRoute = require("./routes/logoutRoute.js");
const facebookLoginRoute = require("./routes/facebookLoginRoute.js");
const googleLoginRoute = require("./routes/googleLoginRoute.js");
const loginAsGuestRoute = require("./routes/loginAsGuestRoute.js");
const USERDAO = require("./DAO/USERDAO.js");
const cookieParser = require("cookie-parser");
const sessionMiddleware = session({
  secret: "co_tuong",
  cookie: {
    maxAge: 60000,
  },
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
});
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

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

app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/verify-email", verifyEmailRoute);
app.use("/logout", logoutRoute);
app.use("/auth/facebook", facebookLoginRoute);
app.use("/auth/google", googleLoginRoute);
app.use("/login-as-guest", loginAsGuestRoute);
app.use("/", entryRoute);

registerIOEvents(io);

module.exports = httpServer;
