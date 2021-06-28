const express = require("express");
const router = express.Router();
const USERDAO = require("../DAO/USERDAO.js");

router.get("/", async (req, res) => {
  try {
    const message = req.session.loginError;
    const opponentID = req.session.opponentID;
    if (req.isAuthenticated()) {
      req.session.opponentID = undefined;
      return res.json({ user: req.user, opponentID: opponentID });
    }
    return res.json({ user: null, message: message });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username } = req.body;
    const user = await USERDAO.findUserByUsername(username);
    return res.json({ user: user.guest ? null : user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
