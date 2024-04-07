var mongoose = require("mongoose");

var ride = new mongoose.Schema(
  {
    rideFrom: { type: mongoose.Schema.Types.ObjectId, ref: "Cities" },
    rideTo: { type: mongoose.Schema.Types.ObjectId, ref: "Cities" },
    rideName: { type: String, required: true },
    rideCapacity: { type: Number, required: true, default: 7 },
    rideCancelledDays: { type: [Date] },
    stops: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cities",
          required: true,
        },
        to: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Cities",
          required: true,
        },
        pickupTime: { type: Date, required: true },
        travelTime: { type: Number, required: true },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    luggage: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Rides", ride);
