const express = require("express");
const router = express.Router();
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const USERDAO = require("../DAO/USERDAO.js");
const checkingSession = require("./api/checkingSession.js");
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
    return res.status(500).json({ message: err.message });
  }
};

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await USERDAO.findUser(username);
      if (user === null)
        return done(null, false, { message: "Incorrect Username Or Email" });
      if (user.password === undefined)
        return done(null, false, { message: "Incorrect Password" });
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
      return done(err.message, null, null);
    }
  })
);

router.post(
  "/",
  checkingSession,
  (req, res, next) => {
    const opponentID = req.session.opponentID;
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return res.status(500).json({ user: null, message: err.message });
      }
      if (!user) {
        if (info.message !== "Incorrect Password")
          return res.json({ user: null, message: info.message });
        else return next();
      }
      req.login(user, (err) => {
        if (err)
          return res.status(500).json({ user: user, message: err.message });
        req.session.opponentID = undefined;
        req.session.save(() => {
          return res.json({
            user: user,
            message: null,
            opponentID: opponentID,
          });
        });
      });
    })(req, res, next);
  },
  handleIncorrectPassword
);

module.exports = router;
