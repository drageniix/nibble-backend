const User = require("../models/user");

const populate = {
  path: "pantry.ingredient",
  select: "name"
};

exports.getPantry = (req, res, next) =>
  User.findById(req.userId)
    .populate(populate)
    .then(user =>
      res
        .status(200)
        .json({ message: "Retrieved pantry.", pantry: user.pantry })
    )
    .catch(err => next(err));

exports.updatePantry = (req, res, next) => {
  const { pantry } = req.body;

  User.findOneAndUpdate(
    { _id: req.userId },
    { $set: { pantry } },
    { new: true }
  )
    .populate(populate)
    .exec()
    .then(user =>
      res.status(200).json({ message: "Updated pantry.", pantry: user.pantry })
    )
    .catch(err => next(err));
};
