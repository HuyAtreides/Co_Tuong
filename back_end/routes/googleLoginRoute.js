const express = require("express");
const router = express.Router();
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const passport = require("passport");
const USERDAO = require("../DAO/USERDAO.js");
const checkingSession = require("./api/checkingSession.js");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/google/callback",
    },
    async (accessToken, _, profile, done) => {
      try {
        const user = await USERDAO.createNewUser(profile);
        return done(null, user);
      } catch (err) {
        return done(err.toString(), null, null);
      }
    }
  )
);

router.get(
  "/",
  checkingSession,
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get("/callback", checkingSession, (req, res, next) => {
  passport.authenticate("google", (err, user, _) => {
    if (err) next(err);
    if (!user) return res.redirect("http://localhost:3000");
    req.login(user, (err) => {
      if (err) req.session.loginError = err.message;
      req.session.save((err) => {
        return res.redirect("http://localhost:3000");
      });
    });
  })(req, res, next);
});

router.use((err, req, res, next) => {
  req.session.loginError = err.message;
  req.session.save((err) => {
    return res.redirect("http://localhost:3000");
  });
});

module.exports = router;
