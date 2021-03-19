const express = require("express");
const router = express.Router();
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const USERDAO = require("../DAO/USERDAO.js");
const bcrypt = require("bcrypt");

const handleIncorrectPassword = async (req, res) => {
  try {
    const { username } = req.body;
    const failedLoginAttempt = await USERDAO.updateFailedLoginAttempt(username);
    if (failedLoginAttempt === 5) {
      const start = new Date();
      const intervalID = setInterval(async () => {
        const timeElapsed = Math.floor((new Date() - start) / 1000);
        if (timeElapsed > 15 * 60) {
          clearInterval(intervalID);
          await USERDAO.resetFailedLoginAttempt(username);
        }
      }, 1000);
      return res.json({
        message:
          "Too many failed login attempt. Please try again in 15 minutes",
      });
    }
    return res.json({ user: null, message: "Incorrect Password" });
  } catch (err) {
    return res.status(500).json({ message: err.toString() });
  }
};

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await USERDAO.findUser(username);
      if (user === null)
        return done(null, false, { message: "Incorrect Username" });
      if (user.password === undefined)
        return done(null, false, { message: "Incorrect Password" });
      if (user.inGame)
        return done(null, false, {
          message:
            "This account is currently in a game. Please try again after the game was finished",
        });
      if (user.failedLoginAttempt === 5)
        return done(null, false, {
          message:
            "Too many failed login attempt. Please try again in 15 minutes",
        });
      bcrypt.compare(password, user.password, async (err, result) => {
        if (err) return done(err, null);
        if (result) {
          await USERDAO.resetFailedLoginAttempt(username);
          return done(null, user, null);
        }
        return done(null, false, { message: "Incorrect Password" });
      });
    } catch (err) {
      return done(err.toString(), null, null);
    }
  })
);

router.post(
  "/",
  (req, res, next) => {
    const sessionID = req.cookies["connect.sid"];
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ user: null, message: err.toString() });
      }
      if (!user) {
        if (info.message !== "Incorrect Password")
          return res.json({ user: null, message: info.message });
        else return next();
      }
      req.login(user, (err) => {
        if (err)
          return res.status(500).json({ user: user, message: err.toString() });
        return res.json({ user: user, message: null, sessionID: sessionID });
      });
    })(req, res, next);
  },
  handleIncorrectPassword
);

module.exports = router;
