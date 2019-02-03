const express = require("express");

const shoppingController = require("../controllers/shopping");
const ingredientMiddleware = require("../middleware/ingredient");
const commonMiddleware = require("../middleware/common");

const router = express.Router();

router.get("/", commonMiddleware.isAuth, shoppingController.getShopping);

router.put(
  "/",
  commonMiddleware.isAuth,
  ingredientMiddleware.validateIngredients,
  shoppingController.updateShopping
);

module.exports = router;
