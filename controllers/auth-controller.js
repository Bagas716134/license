const bcrypt = require("bcryptjs");
const { USER } = require("../data");
const { validate, AuthValidation } = require("../validation");

class AuthController {
  static viewLogin(req, res) {
    if (req.session.user) {
      res.redirect("/license");

      return;
    }

    res.render("login");
  }

  static login(req, res) {
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
  }

  static logout(req, res) {
    req.session.destroy();

    res.redirect("/login");
  }
}

module.exports = AuthController;
