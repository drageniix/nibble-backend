const Rating = require("../models/rating");
const { body } = require("express-validator/check");
const commonMiddleware = require("./common");

exports.validateRating = [
  body("rating")
    .isNumeric()
    .withMessage("Rating must be a number."),
  commonMiddleware.inputValidation
];

exports.alterRatingPermission = (req, res, next) =>
  Rating.findById(req.params.ratingId)
    .then(rating => {
      if (!rating) {
        const error = new Error("Could not find rating.");
        error.statusCode = 404;
        next(error);
      }
      if (
        rating.creator._id.toString() !== req.userId &&
        rating.creator.privilege < 3
      ) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        next(error);
      }
      next();
    })
    .catch(err => next(err));
