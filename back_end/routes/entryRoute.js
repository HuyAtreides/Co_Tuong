const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const sessionID = req.cookies["connect.sid"];
  if (req.isAuthenticated()) {
    if (!req.user.inGame)
      return res.json({ user: req.user, sessionID: sessionID });
    return res.json({
      user: null,
      message:
        "This account is in a game. Please try again after the game was finished",
    });
  }
  return res.json({ user: null });
});

module.exports = router;
