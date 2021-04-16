const express = require("express");
const router = express.Router();

router.get("/:socketid", (req, res) => {
  const socketID = req.params.socketid;
  req.session.opponentID = socketID;
  req.session.save(() => {
    if (req.isAuthenticated()) return res.redirect(process.env.BASE);
    return res.redirect(process.env.BASE + "/signin");
  });
});

module.exports = router;
