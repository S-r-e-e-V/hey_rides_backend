const Bookings = require("../modals/Bookings");
const Cities = require("../modals/Cities");
const Price = require("../modals/Price");

const addPrice = async (req, res, next) => {
  try {
    const price = new Price({
      from: req.body.from,
      to: req.body.to,
      travelTime: req.body.travelTime,
      price: req.body.price,
      luggage: req.body.luggage,
    });
    price
      .save()
      .then((response) => {
        res.status(200).json({ message: "Price added successfully" });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(403).json({
            error: { message: "Price already exist" },
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

const getPrice = async (req, res, next) => {
  try {
    const response = await Price.findOne({ _id: req.params.id }).populate([
      "from",
      "to",
    ]);
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getPrices = async (req, res, next) => {
  try {
    const response = await Price.find()
      .populate("from", "city province country")
      .populate("to", "city province country");
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const updatePrice = async (req, res, next) => {
  try {
    const response = await Price.updateOne(
      { _id: req.params.id },
      {
        from: req.body.from,
        to: req.body.to,
        price: req.body.price,
        luggage: req.body.luggage,
      }
    );
    res.status(200).json(response);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
const removePrice = async (req, res, next) => {
  try {
    const response = await Price.findOneAndDelete({
      _id: req.params.id,
    });
    if (response) {
      return res.status(200).json({ message: "Price deleted successfully" });
    }
    return res.status(200).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
module.exports = {
  addPrice,
  getPrices,
  getPrice,
  updatePrice,
  removePrice,
};
