const express = require("express");
const router = express.Router();
const GithubStrategy = require("passport-github2").Strategy;
const passport = require("passport");
const USERDAO = require("../DAO/USERDAO.js");
const checkingSession = require("./api/checkingSession.js");

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/github/callback",
    },
    async (__, _, profile, done) => {
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
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/callback", checkingSession, (req, res, next) => {
  passport.authenticate("github", (err, user, _) => {
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
  if (err.message.toLowerCase() === "failed to fetch user profile")
    return res.redirect("http://localhost:8080/api/auth/github/");
  req.session.loginError = err.message;
  req.session.save((err) => {
    return res.redirect("http://localhost:3000");
  });
});

module.exports = router;
