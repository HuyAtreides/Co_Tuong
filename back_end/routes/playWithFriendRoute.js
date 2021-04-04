const express = require("express");
const router = express.Router();

router.get("/:socketid", (req, res) => {
  const socketID = req.params.socketid;
  console.log(socketID);
  req.session.opponentID = socketID;
  req.session.save(() => {
    if (req.isAuthenticated()) return res.redirect("http://localhost:3000/");
    return res.redirect("http://localhost:3000/signin");
  });
});

module.exports = router;
