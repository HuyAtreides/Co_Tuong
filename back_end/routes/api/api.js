const express = require("express");
const router = express.Router();
const loginRoute = require("../loginRoute.js");
const signupRoute = require("../signupRoute.js");
const verifyEmailRoute = require("../verifyEmailRoute.js");
const userRoute = require("../userRoute.js");
const logoutRoute = require("../logoutRoute.js");
const facebookLoginRoute = require("../facebookLoginRoute.js");
const googleLoginRoute = require("../googleLoginRoute.js");
const loginAsGuestRoute = require("../loginAsGuestRoute.js");
const githubLoginRoute = require("../githubLoginRoute.js");

router.use("/user", userRoute);
router.use("/login", loginRoute);
router.use("/signup", signupRoute);
router.use("/verify-email", verifyEmailRoute);
router.use("/logout", logoutRoute);
router.use("/auth/facebook", facebookLoginRoute);
router.use("/auth/google", googleLoginRoute);
router.use("/auth/github", githubLoginRoute);
router.use("/login-as-guest", loginAsGuestRoute);

module.exports = router;
