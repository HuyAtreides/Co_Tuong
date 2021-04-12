const express = require("express");
const router = express.Router();
const USERDAO = require("../DAO/USERDAO.js");

router.post("/", async (req, res) => {
  try {
    const { username, choosenLang } = req.body;
    const { result } = await USERDAO.updateUserLang(username, choosenLang);
    if (result.ok) return res.json({ message: "success" });
    else return res.json({ message: "can't update user language" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
