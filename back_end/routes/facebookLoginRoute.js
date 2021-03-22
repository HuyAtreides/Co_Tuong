const express = require("express");
const router = express.Router();
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const USERDAO = require("../DAO/USERDAO.js");
const fetch = require("node-fetch");

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/api/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email", "name"],
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

router.get("/", passport.authenticate("facebook", { scope: "email" }));

router.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:8080/",
    failureRedirect: "http://localhost:8080/",
  })
);

module.exports = router;
