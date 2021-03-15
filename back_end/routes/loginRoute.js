const express = require("express");
const router = express.Router();
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const USERDAO = require("../DAO/USERDAO.js");
const bcrypt = require("bcrypt");

function handleFailedLoginCount(req, res, next) {
  if (req.session.failedLoginCount === 5) {
    const start = new Date();
    const intervalID = setInterval(() => {
      const timeElapse = (new Date() - start) / 1000;
      if (timeElapse > 25 * 60) {
        clearInterval(intervalID);
        req.session.failedLoginCount = 0;
      }
    }, 1000);
    return res.json({
      user: null,
      message: "Too many failed login attempts. Please try again in 25 minutes",
    });
  }
  next();
}

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

router.post("/", handleFailedLoginCount, (req, res) => {
  passport.authenticate("local", (err, user, info) => {
    if (err)
      return res.status(500).json({ user: null, message: err.toString() });
    if (!user) {
      req.session.failedLoginCount += 1;
      return res.json({ user: null, message: info.message });
    }
    req.login(user, (err) => {
      if (err)
        return res.status(500).json({ user: user, message: err.toString() });
      return res.json({ user: user, message: null });
    });
  })(req, res);
});

module.exports = router;
