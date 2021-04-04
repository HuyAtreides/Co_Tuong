const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const message = req.session.loginError;
  const opponentID = req.session.opponentID;
  if (req.isAuthenticated()) {
    req.session.opponentID = undefined;
    return res.json({ user: req.user, opponentID: opponentID });
  }
  return res.json({ user: null, message: message });
});

module.exports = router;
