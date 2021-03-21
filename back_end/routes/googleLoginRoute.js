const express = require("express");
const router = express.Router();
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const passport = require("passport");
const USERDAO = require("../DAO/USERDAO.js");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
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
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:8080/",
    failureRedirect: "http://localhost:8080/",
  })
);

module.exports = router;
