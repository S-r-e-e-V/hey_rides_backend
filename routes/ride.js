const express = require("express");
const router = express.Router();
const RideController = require("../controllers/RideController");
const Authenticate = require("../middlewire/authenticate");

router.post("/add", Authenticate, RideController.addRide);
router.put("/update/:id", Authenticate, RideController.updateRide);
router.delete("/delete/:id", Authenticate, RideController.removeRide);
router.post("/cancel/:id", Authenticate, RideController.cancelRide);
router.get("/rides", RideController.getRides);
router.get("/stop/:from/:to", RideController.getStop);
router.get("/:id", RideController.getRide);

module.exports = router;
