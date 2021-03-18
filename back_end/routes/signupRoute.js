const express = require("express");
const router = express.Router();
const USERDAO = require("../DAO/USERDAO.js");
const bcrypt = require("bcrypt");

const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await USERDAO.findUserByEmail(email);
    if (user) {
      return res.json({ message: "Email has been used" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.toString() });
  }
};

const checkUsername = async (req, res, next) => {
  try {
    const { username } = req.body;
    const user = await USERDAO.findUserByUsername(username);
    if (user) {
      return res.json({ message: "Username isn't available" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: err.toString() });
  }
};

router.post("/", checkEmail, checkUsername, async (req, res) => {
  try {
    const sessionID = req.cookies["connect.sid"];
    const formData = req.body;
    const user = await USERDAO.insertUser(formData);
    return res.json({ user: user, sessionID: sessionID });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
});

module.exports = router;
