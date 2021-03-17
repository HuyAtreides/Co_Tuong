const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) return res.json({ user: req.user });
  return res.json({ user: null });
});

module.exports = router;
