const checkingSession = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect("http://localhost:3000/");
  next();
};

module.exports = checkingSession;
