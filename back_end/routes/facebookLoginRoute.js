const express = require("express");
const router = express.Router();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const USERDAO = require("../DAO/USERDAO.js");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/facebook/callback",
    },
    async (accessToken, _, profile, done) => {
      try {
        const user = await USERDAO.createNewUser(profile);
        done(null, user, null);
      } catch (err) {
        done(err.toString(), null, null);
      }
    }
  )
);

router.get("/", passport.authenticate("facebook"));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login",
  })
);

module.exports = router;
