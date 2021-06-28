const checkingSession = (req, res, next) => {
  if (req.isAuthenticated())
    return res.redirect("https://co-tuong.netlify.app/");
  next();
};

module.exports = checkingSession;
