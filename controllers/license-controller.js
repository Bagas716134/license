const connection = require("../database");
const { formatDateTime } = require("../utils/format-date-time");
const { SCRIPTS } = require("../data");
const { LicenseValidation, validate } = require("../validation");
const moment = require("moment");
const randomString = require("../utils/random-string");

class LicenseController {
  static async index(req, res, next) {
    try {
      const [result] = await connection
        .promise()
        .query("SELECT * FROM licenses ORDER BY id DESC");

      const licenses = result.map(function (item) {
        return {
          ...item,
          start_time: formatDateTime(item.start_time),
          expired_time: formatDateTime(item.expired_time),
        };
      });

      res.render("license/index", { title: "License", licenses });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { script, license_key } = req.params;

      const [result] = await connection
        .promise()
        .query(
          "SELECT * FROM licenses WHERE script = ? AND license_key = ? LIMIT 1",
          [script, license_key]
        );

      let license = result[0];

      if (!license) {
        res.status(422).json({ message: "Invalid license key!" });

        return;
      }

      if (!license.start_time) {
        const startTime = formatDateTime(new Date());
        const expiredTime = formatDateTime(
          moment(startTime).add(license.active_time, "d")
        );

        await connection
          .promise()
          .query(
            "UPDATE licenses SET start_time = ?, expired_time = ? WHERE id = ?",
            [startTime, expiredTime, license.id]
          );

        const [result] = await connection
          .promise()
          .query("SELECT * FROM licenses WHERE id = ? LIMIT 1", [license.id]);

        license = result[0];
      }

      res.status(200).json({
        message: "License verified successfully!",
        ...license,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      res.render("license/create", {
        title: "Create License",
        scripts: SCRIPTS,
      });
    } catch (error) {
      next(error);
    }
  }

  static async edit(req, res, next) {
    try {
      const { id } = req.params;

      const [result] = await connection
        .promise()
        .query("SELECT * FROM licenses WHERE id = ? LIMIT 1", [id]);

      const license = result[0];

      if (!license) {
        throw new Error("License not found!");
      }

      res.render("license/edit", {
        title: "Edit License",
        license,
        scripts: SCRIPTS,
      });
    } catch (error) {
      next(error);
    }
  }

  static async store(req, res, next) {
    try {
      const { count, active_time, script, script_url } = validate(
        LicenseValidation.STORE,
        req,
        res
      );

      for (let i = 0; i < count; i++) {
        await connection
          .promise()
          .query(
            "INSERT INTO licenses (license_key, active_time, script, script_url) VALUES (?, ?, ?, ?)",
            [randomString(35), active_time, script, script_url]
          );
      }

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

      const [result] = await connection
        .promise()
        .query("SELECT * FROM licenses WHERE id = ? LIMIT 1", [id]);

      const license = result[0];

      if (!license) {
        throw new Error("License not found!");
      }

      const expiredTime = license.start_time
        ? formatDateTime(moment(license.start_time).add(active_time, "d"))
        : null;

      const q2 =
        "UPDATE licenses SET active_time = ?, expired_time = ?, script = ?, script_url = ? WHERE id = ?";

      await connection
        .promise()
        .query(q2, [active_time, expiredTime, script, script_url, id]);

      req.flash("status", "success");
      req.flash("message", "License updated successfully");

      res.redirect("/license/edit/" + id);
    } catch (error) {
      next(error);
    }
  }

  static async destroy(req, res) {
    try {
      const { id } = req.params;

      const q = "DELETE FROM licenses WHERE id = ?";

      await connection.promise().query(q, [id]);

      req.flash("status", "success");
      req.flash("message", "License deleted successfully");

      res.redirect("/license");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LicenseController;
