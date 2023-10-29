var mongoose = require("mongoose");

var locations = new mongoose.Schema(
  {
    city: { type: mongoose.Schema.Types.ObjectId, ref: "Cities" },
    location: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Locations", locations);
