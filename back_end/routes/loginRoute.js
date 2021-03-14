const express = require("express");
const router = express.Router();
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const USERDAO = require("../DAO/USERDAO.js");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const [err, user] = await USERDAO.findUser(username);
    if (err) return done(err, false);
    if (user === null)
      return done(null, false, { message: "Incorrect Username" });
    bcrypt.compare(password, user.password, (err, result) => {
      if (err) return done(err, false);
      if (result) return done(null, user, null);
      return done(null, false, { message: "Incorrect Password" });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  const user = await USERDAO.findUser(username);
  done(null, user);
});

router.post("/", (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return res.status(500).send(err.toString());
    return res.json({ user: user, message: info.message });
  })(req, res);
});

module.exports = router;
