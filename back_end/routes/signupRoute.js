const express = require("express");
const router = express.Router();
const USERDAO = require("../DAO/USERDAO.js");
const bcrypt = require("bcrypt");
const verifyEmail = require("./loginRoute.js");

router.post("/", async (req, res) => {
  try {
    const formData = req.body;
    await USERDAO.insertUser(formData);
  } catch (e) {
    res.status(500).json({ message: e.toString() });
  }
});

router.post("/verify-email", async (req, res) => {
  const { email, lastname } = req.body;
  const verifyCode = Math.floor(Math.random() * 89999) + 10000;
  const [err, _] = await verifyEmail({
    from: "xiangqivertification@gmail.com",
    to: email,
    html: `<p style="font-size: 25px">Hi ${lastname}, <br> This is your verification code <strong>${verifyCode}</strong>. Happy playing!</p>`,
    subject: "Verification",
  });
  if (err) return res.status(500).json({ message: err.toString() });
  return res.json({ verifyCode: verifyCode });
});

module.exports = router;
