const express = require("express");
const router = express.Router();
const USERDAO = require("../DAO/USERDAO.js");

router.get("/", async (req, res) => {
  const opponentID = req.session.opponentID;
  try {
    const user = await USERDAO.insertGuest();
    req.session.opponentID = undefined;
    req.session.save(() => {
      return res.json({ user: user, opponentID: opponentID });
    });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

module.exports = router;
