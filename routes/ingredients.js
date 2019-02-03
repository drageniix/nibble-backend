const express = require("express");

const ingredientController = require("../controllers/ingredients");
const router = express.Router();

router.post("/", ingredientController.postIngredient);

module.exports = router;
