var mongoose = require("mongoose");

var cities = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      unique: true,
    },
    province: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Cities", cities);
