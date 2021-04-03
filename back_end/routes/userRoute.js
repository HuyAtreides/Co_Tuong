const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const message = req.session.loginError;
  if (req.isAuthenticated()) {
    return res.json({ user: req.user });
  }
  return res.json({ user: null, message: message });
});

module.exports = router;
