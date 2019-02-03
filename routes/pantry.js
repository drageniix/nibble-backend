const express = require("express");

const pantryController = require("../controllers/pantry");
const ingredientMiddleware = require("../middleware/ingredient");
const commonMiddleware = require("../middleware/common");

const router = express.Router();

router.get("/", commonMiddleware.isAuth, pantryController.getPantry);

router.put(
  "/",
  commonMiddleware.isAuth,
  ingredientMiddleware.validateIngredients,
  pantryController.updatePantry
);

module.exports = router;
