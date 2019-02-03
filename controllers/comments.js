const io = require("../middleware/socket");

const Comment = require("../models/comment");
const Recipe = require("../models/recipe");

exports.postComment = (req, res, next) => {
  const { content } = req.body;

  new Comment({ content, creator: req.userId, recipeId: req.params.recipeId })
    .save()
    .then(async comment => {
      await Recipe.findById(req.params.recipeId).then(recipe => {
        recipe.comments.push(comment._id);
        return recipe.save();
      });

      comment = await comment.populate("creator", "name").execPopulate();

      const response = {
        message: "Created comment.",
        comment
      };

      io.getIO().emit("comments", {
        action: "create",
        ...response
      });

      return res.status(201).json(response);
    })
    .catch(err => next(err));
};

exports.updateComment = (req, res, next) => {
  const { content } = req.body;

  Comment.findOneAndUpdate(
    { _id: req.params.commentId },
    { $set: { content } },
    { new: true }
  )
    .populate("creator", "name")
    .exec()
    .then(comment => {
      const response = {
        message: "Updated comment.",
        comment
      };

      io.getIO().emit("comments", {
        action: "update",
        ...response
      });

      return res.status(200).json(response);
    })
    .catch(err => next(err));
};

exports.deleteComment = async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.recipeId);
  recipe.comments.pull(req.params.commentId);

  Comment.findOneAndDelete({ _id: req.params.commentId })
    .exec()
    .then(async () => {
      await recipe.save();

      const response = {
        message: "Deleted comment.",
        commentId: req.params.commentId,
        recipeId: req.params.recipeId
      };

      io.getIO().emit("comments", {
        action: "delete",
        ...response
      });

      return res.status(200).json(response);
    })
    .catch(err => next(err));
};
