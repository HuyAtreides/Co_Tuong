const express = require("express");
const router = express.Router();
const USERDAO = require("../DAO/USERDAO.js");

router.get("/", async (req, res) => {
  try {
    const user = await USERDAO.insertGuest();
    res.json({ user: user });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

module.exports = router;
