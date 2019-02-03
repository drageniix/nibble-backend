const express = require("express");

const commonMiddleware = require("../middleware/common");
const ratingMiddleware = require("../middleware/ratings");
const ratingController = require("../controllers/ratings");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  commonMiddleware.isAuth,
  ratingMiddleware.validateRating,
  ratingController.postRating
);

router.put(
  "/:ratingId",
  commonMiddleware.isAuth,
  ratingMiddleware.validateRating,
  ratingMiddleware.alterRatingPermission,
  ratingController.updateRating
);

router.delete(
  "/:ratingId",
  commonMiddleware.isAuth,
  ratingMiddleware.alterRatingPermission,
  ratingController.deleteRating
);

module.exports = router;
