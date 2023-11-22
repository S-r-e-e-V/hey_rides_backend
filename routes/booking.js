const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/BookingController");
const Authenticate = require("../middlewire/authenticate");

router.post("/create", Authenticate, BookingController.createBooking);
router.delete("/cancel/:id", Authenticate, BookingController.cancelBooking);
router.delete(
  "/cancel/user/:id",
  Authenticate,
  BookingController.cancelBookingByUser
);
router.post("/bookings", Authenticate, BookingController.getBookings);
router.get("/:id", Authenticate, BookingController.getBooking);
router.get("/user/bookings", Authenticate, BookingController.getUserBookings);
router.put("/driver/update/:id", Authenticate, BookingController.updateDriver);

module.exports = router;
