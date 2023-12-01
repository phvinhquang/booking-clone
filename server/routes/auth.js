const express = require("express");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

const authController = require("../controllers/auth");

router.post("/login", authController.postLogin);

router.post("/register", authController.postRegister);

router.post("/admin/login", authController.postAdminLogin);

router.get("/userInfo", isAuth, authController.getUserInfo);

module.exports = router;
