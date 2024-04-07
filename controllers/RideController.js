const mongoose = require("mongoose");
const Bookings = require("../modals/Bookings");
const Cities = require("../modals/Cities");
const Rides = require("../modals/Rides");
const sendMail = require("../utils/nodemailer");

const addRide = async (req, res, next) => {
  try {
    const ride = new Rides(req.body);
    ride
      .save()
      .then((response) => {
        res.status(200).json({ message: "Ride added successfully" });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(403).json({
            error: { message: "Ride already exist" },
          });
        } else {
          console.log(err);
          res.status(403).json({
            error: err,
          });
        }
      });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getRide = async (req, res, next) => {
  try {
    const response = await Rides.findOne({ _id: req.params.id }).populate([
      "stops.from",
      "stops.to",
      "rideFrom",
      "rideTo",
    ]);
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getRides = async (req, res, next) => {
  try {
    const response = await Rides.find()
      .populate("rideFrom", "city province country")
      .populate("rideTo", "city province country")
      .populate("stops.from", "city province country")
      .populate("stops.to", "city province country");
    if (response) {
      res.status(200).json(response);
    } else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
const getStop = async (req, res, next) => {
  try {
    const response = await Rides.aggregate([
      { $unwind: "$stops" },
      {
        $match: {
          "stops.from": new mongoose.Types.ObjectId(req.params.from),
          "stops.to": new mongoose.Types.ObjectId(req.params.to),
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "rideFrom",
          foreignField: "_id",
          as: "rideFromDetails",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "rideTo",
          foreignField: "_id",
          as: "rideToDetails",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "stops.from",
          foreignField: "_id",
          as: "fromDetails",
        },
      },
      {
        $lookup: {
          from: "cities",
          localField: "stops.to",
          foreignField: "_id",
          as: "toDetails",
        },
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "ride_id",
          as: "bookings",
        },
      },
      {
        $addFields: {
          validBookings: {
            $filter: {
              input: "$bookings",
              as: "booking",
              cond: {
                $not: {
                  $in: [
                    "$$booking.status",
                    ["Cancelled by Admin", "Cancelled by User"],
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          bookings: 0,
        },
      },
    ]);
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const updateRide = async (req, res, next) => {
  try {
    const response = await Rides.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json(response);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
const removeRide = async (req, res, next) => {
  try {
    const response = await Rides.findOneAndDelete({
      _id: req.params.id,
    });
    if (response) {
      return res.status(200).json({ message: "Price deleted successfully" });
    }
    return res.status(200).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
const cancelRide = async (req, res, next) => {
  try {
    const cancelledDays = req.body.rideCancelledDays.map((date) => {
      return new Date(date).toISOString().split("T")[0];
    });
    cancelledDays.sort();
    const response = await Rides.updateOne(
      {
        _id: req.params.id,
      },
      { rideCancelledDays: req.body.rideCancelledDays }
    );
    if (response) {
      const bookings = await Bookings.updateMany(
        {
          ride_id: req.params.id,
          ScheduledToTime: {
            $gte: cancelledDays[0] + "T00:00:00.000Z",
            $lte: cancelledDays[cancelledDays.length - 1] + "T23:59:59.999Z",
          },
        },
        { status: "Cancelled by Admin" }
      );
      if (bookings) {
        const updatedBookings = await Bookings.find({
          ride_id: req.params.id,
          ScheduledToTime: {
            $gte: cancelledDays[0] + "T00:00:00.000Z",
            $lte: cancelledDays[cancelledDays.length - 1] + "T23:59:59.999Z",
          },
        }).populate("user_id", "email");
        updatedBookings.forEach((booking) => {
          const link = "https://heyrides.ca/my-bookings";
          const mailOptions = {
            from: "heyrides06@gmail.com",
            to: booking.user_id.email,
            subject: "Sorry, booking cancelled",
            text: `We regret to inform you that your booking has been cancelled. Please click the link below to view the details: ${link}`,
          };
          sendMail(mailOptions);
        });
        return res.status(200).json({ message: "Ride Cancelled Successfully" });
      }
    }
    return res.status(200).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
module.exports = {
  addRide,
  getRides,
  getRide,
  getStop,
  updateRide,
  removeRide,
  cancelRide,
};
