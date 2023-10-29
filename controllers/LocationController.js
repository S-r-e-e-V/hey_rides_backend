const Bookings = require("../modals/Bookings");
const Cities = require("../modals/Cities");
const Locations = require("../modals/Locations");

const addLocation = async (req, res, next) => {
  try {
    const is_cityExist = await Cities.find({ _id: req.body.city_id }).count();
    if (is_cityExist > 0) {
      const location = new Locations({
        city: req.body.city_id,
        location: req.body.location,
      });
      location
        .save()
        .then((response) => {
          res.status(200).json({ message: "Location added successfully" });
        })
        .catch((err) => {
          if (err.code === 11000) {
            res.status(403).json({
              error: { message: "Location already exist" },
            });
          } else {
            console.log(err);
            res.status(403).json({
              error: err,
            });
          }
        });
    } else {
      res.status(403).json({ error: { message: "City not found" } });
    }
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getLocation = async (req, res, next) => {
  try {
    const response = await Locations.findOne({ _id: req.params.id }).populate(
      "city",
      "city province country"
    );
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getLocations = async (req, res, next) => {
  try {
    const response = await Locations.find(
      req.body.city_id ? { city: req.body.city_id } : {}
    ).populate("city", "city province country");
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const updateLocation = async (req, res, next) => {
  try {
    const is_cityExist = await Cities.find({ _id: req.body.city_id }).count();
    if (is_cityExist > 0) {
      const response = await Locations.updateOne(
        { _id: req.params.id },
        {
          city: req.body.city_id,
          location: req.body.location,
        }
      );
      res.status(200).json(response);
    } else {
      res.status(403).json({ error: { message: "City not found" } });
    }
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
const removeLocation = async (req, res, next) => {
  try {
    const booking = await Bookings.findOne({
      $or: [
        { "from.location_id": req.params.id },
        { "to.location_id": req.params.id },
      ],
    });
    if (!booking) {
      const response = await Locations.findOneAndDelete({
        _id: req.params.id,
      });
      if (response) {
        return res
          .status(200)
          .json({ message: "Location deleted successfully" });
      }
      return res.status(200).json({ error: { message: "Location not found" } });
    } else {
      res
        .status(403)
        .json({ error: { message: "Booking exist for this city" } });
    }
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
module.exports = {
  addLocation,
  getLocations,
  getLocation,
  updateLocation,
  removeLocation,
};
