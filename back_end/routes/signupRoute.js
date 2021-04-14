const express = require("express");
const router = express.Router();
const USERDAO = require("../DAO/USERDAO.js");
const bcrypt = require("bcrypt");

const checkEmail = async (req, res, next) => {
  try {
    let email;
    const formData = req.body;
    if (formData.changes && formData.changes["email.value"])
      email = formData.changes["email.value"];
    else email = formData.email;
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
    let username;
    const formData = req.body;
    if (formData.changes && formData.changes["username"])
      username = formData.changes["username"];
    else username = formData.username;
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

const checkPassword = async (req, res, next) => {
  const { user, currentPassword } = req.body;
  if (currentPassword) {
    const userInfo = await USERDAO.findUserByUsername(user);
    if (userInfo.password === undefined)
      return res.send({ message: "Incorrect Password" });
    bcrypt.compare(currentPassword, userInfo.password, (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Something wrong happened. please try again" });
      if (result) {
        return next();
      }
      return res.json({ message: "Incorrect Password" });
    });
  } else next();
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

router.post(
  "/settings",
  checkUsername,
  checkEmail,
  checkPassword,
  async (req, res) => {
    try {
      const { changes, user } = req.body;
      const newUserProfile = await USERDAO.updateUserProfile(changes, user);
      res.json({ user: newUserProfile, message: null });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
