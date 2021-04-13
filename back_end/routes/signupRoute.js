const express = require("express");
const router = express.Router();
const USERDAO = require("../DAO/USERDAO.js");

const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return next();
    const user = await USERDAO.findUserByEmail(email);
    if (user) {
      return res.json({ message: "Email has been used" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) return next();
    const user = await USERDAO.findUserByUsername(username);
    if (user) {
      return res.json({ message: "Username isn't available" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

router.post("/", checkEmail, checkUsername, async (req, res) => {
  try {
    const formData = req.body;
    const user = await USERDAO.insertUser(formData);
    if (req.user) return res.json({ user: req.user, message: null });
    const opponentID = req.session.opponentID;
    req.login(user, (err) => {
      if (err)
        return res.status(500).json({ user: user, message: err.message });
      req.session.opponentID = undefined;
      req.session.save(() => {
        return res.json({ user: user, message: null, opponentID: opponentID });
      });
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/settings", checkUsername, checkEmail, async (req, res) => {
  try {
    const { changes, user } = req.body;
    const { newUserProfile } = await USERDAO.updateUserProfile(changes, user);
    res.json({ user: newUserProfile, message: null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
