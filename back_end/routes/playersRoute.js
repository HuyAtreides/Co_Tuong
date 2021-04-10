const { response } = require("express");
const express = require("express");
const router = express.Router();
const USERDAO = require("../DAO/USERDAO.js");

router.post("/", async (req, res) => {
  try {
    const { playername, exact } = req.body;
    const players = await USERDAO.findPlayers(playername, exact);
    return res.json({ players: players });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
