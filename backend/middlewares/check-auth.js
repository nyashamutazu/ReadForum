const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const getTokenFromHeader = () => {
      if (req.headers.authorisation.split(" ")[0] === "Bearer") {
        return req.headers.authorisation.split(" ")[1];
      }
      return null;
    };

    const token = getTokenFromHeader();

    req["required"] = token ? jwt.verify(token, "user_secret") : null;

    next();
  } catch (err) {
    req["required"] = null;
    next();
  }
};
