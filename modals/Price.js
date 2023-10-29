var mongoose = require("mongoose");

var price = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "Cities" },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "Cities" },
    price: {
      type: Number,
      required: true,
    },
    luggage: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Price", price);
