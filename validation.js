const Joi = require("joi");

const validate = (schema, req, res, redirectRoute) => {
  const { error, value } = schema.validate(req.body);

  if (error) {
    req.flash("status", "error");
    req.flash("message", error.message);

    return res.redirect(redirectRoute ? redirectRoute : req.get("referer"));
  }

  return value;
};

class AuthValidation {
  static LOGIN = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
}

class LicenseValidation {
  static STORE = {};
  static UPDATE = {
    active_time: Joi.number().required(),
    script: Joi.string().required(),
    script_url: Joi.string().required(),
  };
}

module.exports = { validate, AuthValidation, LicenseValidation };
