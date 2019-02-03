const Rating = require("../models/rating");
const Recipe = require("../models/recipe");

exports.postRating = (req, res, next) => {
  const { rating } = req.body;

  new Rating({ rating, creator: req.userId, recipeId: req.params.recipeId })
    .save()
    .then(async rating => {
      await Recipe.findById(req.params.recipeId).then(recipe => {
        recipe.ratings.push(rating._id);
        return recipe.save();
      });

      const response = {
        message: "Created rating.",
        rating
      };

      return res.status(201).json(response);
    })
    .catch(err => next(err));
};

exports.updateRating = (req, res, next) => {
  const { rating } = req.body;

  Rating.findOneAndUpdate(
    { _id: req.params.commentId },
    { $set: { rating } },
    { new: true }
  )
    .exec()
    .then(rating => {
      const response = {
        message: "Updated rating.",
        rating
      };

      return res.status(200).json(response);
    })
    .catch(err => next(err));
};

exports.deleteRating = async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.recipeId);
  recipe.ratings.pull(req.params.ratingId);

  Rating.findOneAndDelete({ _id: req.params.ratingId })
    .exec()
    .then(async () => {
      await recipe.save();

      const response = {
        message: "Deleted rating.",
        ratingId: req.params.ratingId,
        recipeId: req.params.recipeId
      };

      return res.status(200).json(response);
    })
    .catch(err => next(err));
};
