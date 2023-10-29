const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");
const Authenticate = require("../middlewire/authenticate");

router.post("/create", Authenticate, BookingController.createBooking);
router.delete("/cancel/:id", Authenticate, BookingController.cancelBooking);
router.get("/bookings", BookingController.getBookings);
router.get("/:id", BookingController.getBooking);

module.exports = router;
