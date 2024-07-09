const bcrypt = require("bcryptjs");
const { USER } = require("../data");
const { validate, AuthValidation } = require("../validation");

class AuthController {
  static viewLogin(req, res, next) {
    try {
      if (req.session.user) {
        res.redirect("/license");

        return;
      }

      res.render("login", { title: "Log in" });
    } catch (error) {
      next(error);
    }
  }

  static login(req, res, next) {
    try {
      const { username, password } = validate(AuthValidation.LOGIN, req, res);

      if (
        username === USER.username &&
        bcrypt.compareSync(password, USER.password)
      ) {
        req.session.user = { username: USER.username };

        res.redirect("/license");

        return;
      }

      req.flash("status", "error");
      req.flash("message", "Invalid username or password!");

      res.redirect("/login");
    } catch (error) {
      next(error);
    }
  }

  static logout(req, res, next) {
    try {
      req.session.destroy();

      res.redirect("/login");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
