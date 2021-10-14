const cors = require('cors');
const express = require('express');
const app = express();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const httpServer = require('http').createServer(app);
const registerIOEvents = require('./registerIOEvents/registerIOEvents.js');
const api = require('./routes/api/api.js');
const USERDAO = require('./DAO/USERDAO.js');
const uploadsRoutes = require('./routes/uploadsRoute.js');
const configCookie = require('./configCookie.js');
const sessionMiddleware = session({
  secret: 'co_tuong',
  cookie: {
    maxAge: 259200000,
    secure: true,
    sameSite: 'none',
    domain: '',
  },
  proxy: true,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
});
const io = require('socket.io')(httpServer, {
  cors: {
    origin: process.env.BASE,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 17000,
});

app.use(cors({ origin: process.env.BASE, credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(configCookie);
app.use(passport.session());

passport.serializeUser((user, done) => {
  return done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  const user = await USERDAO.findUser(username);
  return done(null, user);
});

app.use('/api', api);
app.use('/uploads', uploadsRoutes);

registerIOEvents(io);

module.exports = httpServer;
