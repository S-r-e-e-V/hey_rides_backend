const Bookings = require("../modals/Bookings");
const Cities = require("../modals/Cities");
const Locations = require("../modals/Locations");

const addCity = async (req, res, next) => {
  try {
    const city = new Cities({
      city: req.body.city,
      province: req.body.province,
      country: req.body.country,
    });
    city
      .save()
      .then((response) => {
        res.status(200).json({ message: "City added successfully" });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(403).json({
            error: { message: "City already exist" },
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

const getCity = async (req, res, next) => {
  try {
    const response = await Cities.findOne({ _id: req.params.id });
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getCities = async (req, res, next) => {
  try {
    const response = await Cities.find();
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const updateCity = async (req, res, next) => {
  try {
    const response = await Cities.updateOne(
      { _id: req.params.id },
      {
        city: req.body.city,
        province: req.body.province,
        country: req.body.country,
      }
    );
    res.status(200).json(response);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
const removeCity = async (req, res, next) => {
  try {
    const booking = await Bookings.findOne({
      $or: [{ "from.city_id": req.params.id }, { "to.city_id": req.params.id }],
    });
    if (!booking) {
      const response = await Cities.findOneAndDelete({
        _id: req.params.id,
      });
      if (response) {
        const location = await Locations.deleteMany({
          city_id: req.params.id,
        });
        return res.status(200).json({ message: "City deleted successfully" });
      }
      return res.status(200).json({ error: { message: "City not found" } });
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
module.exports = { addCity, getCities, getCity, updateCity, removeCity };
