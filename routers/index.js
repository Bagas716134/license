const router = require("express").Router();
const AuthController = require("../controllers/auth-controller");
const LicenseController = require("../controllers/license-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/", (req, res) => {
  res.redirect("/login");
});

// License Access
router.get("/login/:script/:license_key", LicenseController.login);

// Auth Routes
router.get("/login", AuthController.viewLogin);
router.post("/login", AuthController.login);
router.get("/logout", authMiddleware, AuthController.logout);

// License Routes
router.use(authMiddleware);
router.get("/license", LicenseController.index);
router.get("/license/create", LicenseController.create);
router.get("/license/edit/:id", LicenseController.edit);
router.post("/license", LicenseController.store);
router.patch("/license/:id", LicenseController.update);
router.delete("/license/:id", LicenseController.destroy);

module.exports = router;
