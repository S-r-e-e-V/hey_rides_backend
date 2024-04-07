const Bookings = require("../modals/Bookings");
const Cities = require("../modals/Cities");
const Locations = require("../modals/Locations");
const sendMail = require("../utils/nodemailer");

const createBooking = async (req, res, next) => {
  try {
    const booking = new Bookings({
      user_id: req.user.id,
      ...req.body,
    });
    booking
      .save()
      .then((response) => {
        const link = "https://heyrides.ca/my-bookings";
        const mailOptions = {
          from: "heyrides06@gmail.com",
          to: req.user.email,
          subject: "Booking Confirmation from Heyrides",
          text: `Your booking has been confirmed. Please click on the followinglink to access booking details. ${link}`,
        };

        sendMail(mailOptions);
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
    })
      .populate("from.location_id", "city location")
      .populate("to.location_id", "city location")
      .populate("from.city_id", "city province country")
      .populate("to.city_id", "city province country")
      .populate("user_id", "name phone")
      .populate("ride_id", "rideName")
      .populate("driver");
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  var date = new Date();
  var today = new Date(date.toDateString());
  var endDate = new Date(date.setMonth(today.getMonth() + 3));
  var isPending = req.body.isPending;
  try {
    const response = await Bookings.find(
      !isPending
        ? {
            ScheduledToTime: {
              $lte: req.body.endTime ?? new Date(endDate.toDateString()),
              $gte: req.body.startTime ?? today,
            },
          }
        : { status: "Pending" }
    )
      .sort({ createdAt: -1 })
      .populate("from.location_id", "city location")
      .populate("to.location_id", "city location")
      .populate("from.city_id", "city province country")
      .populate("to.city_id", "city province country")
      .populate("user_id", "name phone")
      .populate("ride_id", "rideName")
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
      .sort({ createdAt: -1 })
      .populate("from.location_id", "city location")
      .populate("to.location_id", "city location")
      .populate("from.city_id", "city province country")
      .populate("to.city_id", "city province country")
      .populate("user_id", "name phone")
      .populate("ride_id", "rideName")
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
    const booking = await Bookings.findOneAndUpdate(
      { _id: req.params.id },
      {
        status: "Cancelled by Admin",
      }
    ).populate("user_id", "email");
    if (booking) {
      const link = "https://heyrides.ca/my-bookings";
      const mailOptions = {
        from: "heyrides06@gmail.com",
        to: booking.user_id.email,
        subject: "Sorry, booking cancelled",
        text: `"We regret to inform you that your booking has been cancelled. Please click the link below to view the details: ${link}`,
      };
      sendMail(mailOptions);
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
