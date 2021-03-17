const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  req.logout();
  res.json({ message: "sucessfully logout" });
});

module.exports = router;
