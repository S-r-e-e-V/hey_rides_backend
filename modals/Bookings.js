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
    price: {
      type: Number,
      required: true,
    },
    ScheduledToTime: { type: Date, required: true },
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Bookings", bookings);
