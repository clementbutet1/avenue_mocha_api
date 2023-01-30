const express = require("express");
const router = express.Router();
const { createCoffee, getAllCoffees, update, getCoffeeById } = require("../controllers/coffees");
const multer = require("multer");
const path = require("path");
const CoffeesModel = require("../models/coffees");
const checkAuth = require("../middleware/checkAuth");

router.post("/create", [checkAuth], createCoffee);
router.put("/:_id", [checkAuth], update);
router.get("/:_id", [checkAuth], getCoffeeById);
router.get("/", [checkAuth], getAllCoffees);

module.exports = router;