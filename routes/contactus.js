const express = require("express");
const router = express.Router();
const ContactUs = require("../controllers/ContactUsController");
const Authenticate = require("../middlewire/authenticate");

router.post("/", ContactUs.ContactUs);

module.exports = router;
