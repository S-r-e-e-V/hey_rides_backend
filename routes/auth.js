const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const Authenticate = require("../middlewire/authenticate");

router.post("/signup", AuthController.register);
router.post("/login", AuthController.login);

router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

module.exports = router;
