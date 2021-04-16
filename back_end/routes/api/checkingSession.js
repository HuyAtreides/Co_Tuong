const checkingSession = (req, res, next) => {
  if (req.isAuthenticated()) return res.redirect(process.env.BASE);
  next();
};

module.exports = checkingSession;
