const jwt = require("jsonwebtoken");

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(403)
      .send({ message: "Unauthorized ! Access Token was expired !" });
  }
  return res.status(401).send({ message: "Unauthorized" });
};

module.exports = (req, res, next) => {
  const token = req.session.token;
  try {
    if (!token) {
      return res.status(403).send({ message: "No token provided !" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return catchError(err, res);
      }
      req.userData = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};