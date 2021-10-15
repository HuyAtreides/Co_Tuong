const checkingSession = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect(process.env.REDIRECT_URL);
  next();
};

module.exports = checkingSession;
