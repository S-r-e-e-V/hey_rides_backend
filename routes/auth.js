const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const Authenticate = require("../middlewire/authenticate");

router.post("/signup", AuthController.register);
router.post("/login", AuthController.login);

router.put("/change-password", AuthController.updatePassowrd);
router.put("/update-profile", Authenticate, AuthController.updateProfile);

module.exports = router;
