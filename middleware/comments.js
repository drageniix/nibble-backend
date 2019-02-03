const Comment = require("../models/comment");
const { body } = require("express-validator/check");
const commonMiddleware = require("./common");

exports.validateComment = [
  body("content")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Comment must not be empty."),
  commonMiddleware.inputValidation
];

exports.alterCommentPermission = (req, res, next) =>
  Comment.findById(req.params.commentId)
    .then(comment => {
      if (!comment) {
        const error = new Error("Could not find comment.");
        error.statusCode = 404;
        next(error);
      }
      if (
        comment.creator._id.toString() !== req.userId &&
        comment.creator.privilege < 3
      ) {
        const error = new Error("Not authorized!");
        error.statusCode = 403;
        next(error);
      }
      next();
    })
    .catch(err => next(err));
