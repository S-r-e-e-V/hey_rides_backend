const express = require("express");
const router = express.Router();
const LocationController = require("../controllers/LocationController");
const Authenticate = require("../middlewire/authenticate");

router.post("/add", Authenticate, LocationController.addLocation);
router.put("/update/:id", Authenticate, LocationController.updateLocation);
router.delete("/delete/:id", Authenticate, LocationController.removeLocation);
router.post("/locations", LocationController.getLocations);
router.get("/:id", LocationController.getLocation);

module.exports = router;
