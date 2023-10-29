const express = require("express");
const router = express.Router();
const PriceController = require("../controllers/PriceController");
const Authenticate = require("../middlewire/authenticate");

router.post("/add", Authenticate, PriceController.addPrice);
router.put("/update/:id", Authenticate, PriceController.updatePrice);
router.delete("/delete/:id", Authenticate, PriceController.removePrice);
router.get("/prices", PriceController.getPrices);
router.get("/:id", PriceController.getPrice);

module.exports = router;
