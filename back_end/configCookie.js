const configCookie = (req, res, next) => {
  req.headers["x-forwarded-proto"] = "https";
  req.session.cookie.secure = true;
  req.session.cookie.sameSite = "none";
  req.session.cookie.domain = "";
  next();
};

module.exports = configCookie;
