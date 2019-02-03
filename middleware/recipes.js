const Recipe = require("../models/recipe");
const { body } = require("express-validator/check");
const commonMiddleware = require("./common");
const { checkIngredients } = require("./ingredient");

exports.validateRecipe = [
  body("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Please enter a title."),
  body("image")
    .not()
    .isEmpty(),
  body("instructions")
    .withMessage("Please enter some instructions.")
    .custom(instructions => instructions.length > 0),
  checkIngredients,
  commonMiddleware.inputValidation
];

exports.alterRecipePermission = (req, res, next) =>
  Recipe.findById(req.params.recipeId)
    .then(recipe => {
      if (!recipe) {
        const error = new Error("Could not find recipe.");
        error.statusCode = 404;
        next(error);
      }
      if (
        recipe.creator._id.toString() !== req.userId &&
        recipe.creator.privilege < 2
      ) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        next(error);
      }
      next();
    })
    .catch(err => next(err));
