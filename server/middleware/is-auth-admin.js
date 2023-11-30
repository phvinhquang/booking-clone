module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json("Not Authorized");
  }

  if (!req.user.isAdmin) {
    return res.status(401).json("Not An Admin :)");
  }

  next();
};
