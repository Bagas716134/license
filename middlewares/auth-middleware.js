const authMiddleware = (req, res, next) => {
  if (!req.session.user) {
    // res.status(401).send("Unauthorized");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports = authMiddleware;
