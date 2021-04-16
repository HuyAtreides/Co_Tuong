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
      callbackURL:
        "https://co-tuong-online.herokuapp.com/api/auth/google/callback",
    },
    async (accessToken, _, profile, done) => {
      try {
        if (profile.photos[0]) {
          const largePhoto = profile.photos[0].value.replace("s96-c", "s200-c");
          profile.photos[0].value = largePhoto;
        }
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
    if (!user) return res.redirect(process.env.BASE);
    req.login(user, (err) => {
      if (err) req.session.loginError = err.message;
      req.session.save((err) => {
        return res.redirect(process.env.BASE);
      });
    });
  })(req, res, next);
});

router.use((err, req, res, next) => {
  req.session.loginError = "Something Wrong Happend. Please Try Again";
  req.session.save((err) => {
    return res.redirect(process.env.BASE);
  });
});

module.exports = router;
