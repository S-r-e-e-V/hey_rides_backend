var mongoose = require("mongoose");

var bookings = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    ride_id: { type: mongoose.Schema.Types.ObjectId, ref: "Rides" },
    from: {
      location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locations" },
      city_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cities" },
      customLocation: { type: String, default: null },
    },
    to: {
      location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locations" },
      city_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cities" },
      customLocation: { type: String, default: null },
    },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    price: {
      type: Number,
      required: true,
    },
    status: { type: String, default: "Pending", required: true },
    ScheduledToTime: { type: Date, required: true },
    adult: {
      type: Number,
      required: true,
    },
    luggage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Bookings", bookings);
