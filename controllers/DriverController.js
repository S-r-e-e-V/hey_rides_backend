const Driver = require("../modals/Driver");

const addDriver = async (req, res, next) => {
  try {
    const driver = new Driver({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
    });
    driver
      .save()
      .then((response) => {
        res.status(200).json({ message: "Driver added successfully" });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(403).json({
            error: { message: "Phone number already exist" },
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

const getDriver = async (req, res, next) => {
  try {
    const response = await Driver.findOne({ _id: req.params.id });
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const getDrivers = async (req, res, next) => {
  try {
    const response = await Driver.find();
    if (response) res.status(200).json(response);
    else res.status(400).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const updateDriver = async (req, res, next) => {
  try {
    const response = await Driver.updateOne(
      { _id: req.params.id },
      {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
      }
    );
    res.status(200).json(response);
  } catch (error) {
    error.status = 400;
    next(error);
  }
};

const removeDriver = async (req, res, next) => {
  try {
    const response = await Driver.findOneAndDelete({
      _id: req.params.id,
    });
    if (response) {
      return res.status(200).json({ message: "Driver removed successfully" });
    }
    return res.status(200).json({ error: { message: "Data not found" } });
  } catch (error) {
    error.status = 400;
    next(error);
  }
};
module.exports = {
  addDriver,
  getDrivers,
  getDriver,
  updateDriver,
  removeDriver,
};
