const express = require("express");
const router = express.Router();
const CityController = require("../controllers/CityController");
const Authenticate = require("../middlewire/authenticate");

router.post("/add", Authenticate, CityController.addCity);
router.put("/update/:id", Authenticate, CityController.updateCity);
router.delete("/delete/:id", Authenticate, CityController.removeCity);
router.get("/cities", CityController.getCities);
router.get("/:id", CityController.getCity);

module.exports = router;
