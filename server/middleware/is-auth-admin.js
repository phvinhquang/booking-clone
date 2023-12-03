require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeaders = req.get("Authorization");
  if (!authHeaders) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    throw err;
  }

  const token = authHeaders.split(" ")[1];
  if (!token) {
    const err = new Error("Not authorized");
    err.statusCode = 401;
    throw err;
  }
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
  } catch (err) {
    err.statusCode = 555;
    next(err);
  }

  // Nếu verify fail
  if (!decodedToken) {
    const error = new Error("Not authenticated");
    error.statusCode = 401;
    throw error;
  }

  req.userId = decodedToken.userId;
  next();
};
