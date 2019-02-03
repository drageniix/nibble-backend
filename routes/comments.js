const express = require("express");

const commonMiddleware = require("../middleware/common");
const commentMiddleware = require("../middleware/comments");
const commentController = require("../controllers/comments");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  commonMiddleware.isAuth,
  commentMiddleware.validateComment,
  commentController.postComment
);

router.put(
  "/:commentId",
  commonMiddleware.isAuth,
  commentMiddleware.validateComment,
  commentMiddleware.alterCommentPermission,
  commentController.updateComment
);

router.delete(
  "/:commentId",
  commonMiddleware.isAuth,
  commentMiddleware.alterCommentPermission,
  commentController.deleteComment
);

module.exports = router;
