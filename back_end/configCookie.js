const configCookie = (req, res, next) => {
  req.headers["x-forwarded-proto"] = "https";
  req.session.cookie.secure = true;
  req.session.cookie.sameSite = "none";
  next();
};

module.exports = configCookie;
