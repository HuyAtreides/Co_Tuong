const express = require("express");
const USERDAO = require("../DAO/USERDAO");
const router = express.Router();
const verifyEmail = require("./verifyEmail.js");

const handleIncorrectCode = async (req, res) => {
  try {
    const { username } = req.body;

    const failedVerifyAttempt = await USERDAO.updateFailedVerifyAttempt(
      username
    );
    if (failedVerifyAttempt === 5) {
      const start = new Date();
      const intervalID = setInterval(async () => {
        const timeElapsed = Math.floor((new Date() - start) / 1000);
        if (timeElapsed > 15 * 60) {
          clearInterval(intervalID);
          await USERDAO.resetFailedVerifyAttempt(username);
        }
      }, 1000);
      return res.json({
        message:
          "Too many failed verify attempt. Please try again in 15 minutes",
      });
    }
    return res.json({ message: "Incorrect Code" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

router.post(
  "/code",
  async (req, res, next) => {
    try {
      const { correct, username } = req.body;
      const user = await USERDAO.findUserByUsername(username);
      if (user.failedVerifyAttempt === 5)
        return res.json({
          message:
            "Too many failed verify attempt. Please try again in 15 minutes",
        });
      if (!correct) return next();
      await USERDAO.resetFailedVerifyAttempt(username);
      const updatedUser = await USERDAO.updateUserEmail(username);
      return res.json({ user: updatedUser });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  handleIncorrectCode
);

router.post("/", async (req, res) => {
  try {
    const { email, lastname } = req.body;
    const verifyCode = Math.floor(Math.random() * 89999) + 10000;
    const capitalLastname = lastname[0].toUpperCase() + lastname.slice(1);
    await verifyEmail({
      from: process.env.EMAIL,
      to: email,
      html: `<p style="font-size: 22px">Hi ${capitalLastname}, <br>Thank you for using my app.<br> This is your verification code <strong>${verifyCode}</strong>.<br> Happy playing!</p>`,
      subject: "Verification",
    });
    return res.json({ code: verifyCode });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
