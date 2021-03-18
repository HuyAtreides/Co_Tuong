const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  const sessionID = req.cookies["connect.sid"];
  if (req.isAuthenticated())
    return res.json({ user: req.user, sessionID: sessionID });
  return res.json({ user: null });
});

module.exports = router;
