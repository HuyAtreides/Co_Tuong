const express = require("express");
const router = express.Router();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const USERDAO = require("../DAO/USERDAO.js");
const checkingSession = require("./api/checkingSession.js");
const fetch = require("node-fetch");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "email",
        "name",
        "picture.type(large)",
      ],
    },

    async (accessToken, _, profile, done) => {
      try {
        const user = await USERDAO.createNewUser(profile);
        return done(null, user);
      } catch (err) {
        console.log(err.toString());
        return done(err.toString(), null, null);
      }
    }
  )
);

router.get(
  "/",
  checkingSession,
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get("/callback", checkingSession, (req, res, next) => {
  passport.authenticate("facebook", (err, user, _) => {
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
  req.session.loginError = "Something Wrong Happend. Please Try Again";
  req.session.save((err) => {
    return res.redirect("http://localhost:3000");
  });
});

module.exports = router;
