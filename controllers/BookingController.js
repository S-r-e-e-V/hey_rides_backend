const Bookings = require("../modals/Bookings");
const Cities = require("../modals/Cities");
const Locations = require("../modals/Locations");

const createBooking = async (req, res, next) => {
  try {
    const booking = new Bookings({
      user_id: req.user.id,
      ...req.body,
    });
    booking
      .save()
      .then((response) => {
        res.status(200).json({ message: "Booking created successfully" });
      })
      .catch((err) => {
        console.log(err);
        res.status(403).json({
          error: err,
        });
      });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const response = await Bookings.findOne({
      _id: req.params.id,
      isCancelled: false,
    })
      .populate("from.location_id", "city location")
      .populate("to.location_id", "city location")
      .populate("from.city_id", "city province country")
      .populate("to.city_id", "city province country")
      .populate("user_id", "name")
      .populate("driver");
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const response = await Bookings.find()
      .populate("from.location_id", "city location")
      .populate("to.location_id", "city location")
      .populate("from.city_id", "city province country")
      .populate("to.city_id", "city province country")
      .populate("user_id", "name")
      .populate("driver");

    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getUserBookings = async (req, res, next) => {
  try {
    const response = await Bookings.find({ user_id: req.user.id })
      .populate("from.location_id", "city location")
      .populate("to.location_id", "city location")
      .populate("from.city_id", "city province country")
      .populate("to.city_id", "city province country")
      .populate("user_id", "name")
      .populate("driver");

    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const updateDriver = async (req, res, next) => {
  try {
    const response = await Bookings.updateOne(
      { _id: req.params.id },
      {
        driver: req.body.driver_id,
        status: "Confirmed",
      }
    );
    res.status(200).json(response);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Bookings.updateOne(
      { _id: req.params.id },
      {
        status: "Cancelled by Admin",
      }
    );
    if (booking) {
      res.status(200).json({ message: "Booking cancelled Successfully" });
    }
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const cancelBookingByUser = async (req, res, next) => {
  try {
    const booking = await Bookings.updateOne(
      { _id: req.params.id },
      {
        status: "Cancelled by User",
      }
    );
    if (booking) {
      res.status(200).json({ message: "Booking cancelled Successfully" });
    }
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBooking,
  cancelBooking,
  getUserBookings,
  updateDriver,
  cancelBookingByUser,
};
