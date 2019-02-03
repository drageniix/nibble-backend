const express = require("express");

const commentRoutes = require("./comments");
const ratingRoutes = require("./ratings");

const recipesController = require("../controllers/recipes");
const recipesMiddleware = require("../middleware/recipes");
const commonMiddleware = require("../middleware/common");

const router = express.Router();

router.get("/", recipesController.getRecipes);

router.post(
  "/",
  commonMiddleware.isAuth,
  recipesMiddleware.validateRecipe,
  recipesController.createRecipe
);

router.get("/:recipeId", recipesController.getRecipe);

router.put(
  "/:recipeId",
  commonMiddleware.isAuth,
  recipesMiddleware.validateRecipe,
  recipesMiddleware.alterRecipePermission,
  recipesController.updateRecipe
);

router.delete(
  "/:recipeId",
  commonMiddleware.isAuth,
  recipesMiddleware.alterRecipePermission,
  recipesController.deleteRecipe
);

router.use("/:recipeId/comments", commentRoutes);
router.use("/:recipeId/ratings", ratingRoutes);

module.exports = router;
