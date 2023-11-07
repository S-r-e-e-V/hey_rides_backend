var mongoose = require("mongoose");

var driver = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: { type: Number, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Driver", driver);
