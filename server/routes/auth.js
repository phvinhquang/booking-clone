const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth");

router.post("/login", authController.postLogin);

router.post("/register", authController.postRegister);

router.post("/admin/login", authController.postAdminLogin);

router.get("/userInfo", authController.getUserInfo);

module.exports = router;
