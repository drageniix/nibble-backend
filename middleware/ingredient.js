const Ingredient = require("../models/ingredient");
const { body } = require("express-validator/check");
const commonMiddleware = require("./common");

const checkIngredients = body("ingredients").custom(ingredients =>
  Promise.all(
    ingredients.map(async ingredient => {
      if (typeof ingredient.quantity !== "number") {
        Promise.reject("Check quantity.");
      } else if (typeof ingredient.measurement !== "string") {
        //TODO: valid measurement array
        Promise.reject("Check measurement.");
      } else {
        return await Ingredient.findOne({
          name: { $regex: ingredient.ingredient, $options: "i" }
        }).then(ingredient => {
          if (!ingredient) {
            Promise.reject("Unknown ingredient.");
          }
        });
      }
    })
  )
);

exports.checkIngredients = checkIngredients;
exports.validateIngredients = [
  checkIngredients,
  commonMiddleware.inputValidation
];
