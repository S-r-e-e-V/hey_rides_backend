var mongoose = require("mongoose");

var bookings = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    from: {
      location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locations" },
      city_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cities" },
    },
    to: {
      location_id: { type: mongoose.Schema.Types.ObjectId, ref: "Locations" },
      city_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cities" },
    },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    price: {
      type: Number,
      required: true,
    },
    status: { type: String, default: "Pending", required: true },
    ScheduledToTime: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Bookings", bookings);
