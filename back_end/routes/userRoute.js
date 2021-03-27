const express = require("express");
const router = express.Router();
const USERDAO = require("../DAO/USERDAO.js");

router.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await USERDAO.findUser(req.user.username);
    if (!user.inGame) return res.json({ user: user });
    return res.json({
      user: null,
      message:
        "This account is in a game. Please try again after the game was finished",
    });
  }
  return res.json({ user: null });
});

module.exports = router;
