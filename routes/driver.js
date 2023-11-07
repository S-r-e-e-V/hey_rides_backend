const express = require("express");
const router = express.Router();
const DriverController = require("../controllers/DriverController");
const Authenticate = require("../middlewire/authenticate");

router.post("/add", Authenticate, DriverController.addDriver);
router.put("/update/:id", Authenticate, DriverController.updateDriver);
router.delete("/delete/:id", Authenticate, DriverController.removeDriver);
router.get("/drivers", DriverController.getDrivers);
router.get("/:id", DriverController.getDriver);

module.exports = router;
