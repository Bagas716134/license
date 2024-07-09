const connection = require("../database");
const { formatDateTime } = require("../utils/format-date-time");
const { SCRIPTS } = require("../data");
const { randomUUID } = require("crypto");
const { validate } = require("uuid");
const { LicenseValidation } = require("../validation");

class LicenseController {
  static async index(req, res, next) {
    try {
      const data = await connection
        .promise()
        .query("SELECT * FROM licenses ORDER BY id DESC");

      const licenses = data[0].map((item) => {
        return {
          ...item,
          start_time: formatDateTime(item.start_time),
          expired_time: formatDateTime(item.expired_time),
        };
      });

      res.render("license/index", { licenses });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { script, license_key } = req.params;

      res.send({ script, license_key });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    res.render("license/create", {
      scripts: SCRIPTS,
    });
  }

  static async edit(req, res, next) {
    try {
      const { id } = req.params;

      const data = await connection
        .promise()
        .query("SELECT * FROM licenses WHERE id = ? LIMIT 1", [id]);

      const license = data[0][0];

      res.render("license/edit", { license, scripts: SCRIPTS });
    } catch (error) {
      next(error);
    }
  }

  static async store(req, res, next) {
    try {
      const { active_time, script, script_url } = req.body;

      const license = {
        license_key: randomUUID().toString(),
        active_time: active_time,
        script: script,
        script_url: script_url,
      };

      const data = connection
        .promise()
        .query(
          "INSERT INTO licenses (license_key, active_time, script, script_url) VALUES (?, ?, ?, ?)",
          Object.values(license)
        );

      console.log(data);

      res.redirect("/license");
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      validate(LicenseValidation.UPDATE, req, res);

      const { id } = req.params;
      const { active_time, script, script_url } = req.body;

      connection
        .promise()
        .query(
          "UPDATE licenses SET active_time = ?, script = ?, script_url = ? WHERE id = ?",
          [active_time, script, script_url, id]
        );

      req.flash("status", "success");
      req.flash("message", "License updated successfully");

      res.redirect("/license/edit/" + id);
    } catch (error) {
      next(error);
    }
  }

  static async destroy(req, res) {
    const { id } = req.params;
    const data = await connection
      .promise()
      .query("DELETE FROM licenses WHERE id = ?", [id]);

    res.redirect("/license");
  }
}

module.exports = LicenseController;
