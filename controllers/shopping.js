const User = require("../models/user");

const populate = {
  path: "shopping.ingredient",
  select: "name"
};

exports.getShopping = (req, res, next) =>
  User.findById(req.userId)
    .populate(populate)
    .then(user =>
      res
        .status(200)
        .json({ message: "Retrieved shopping.", shopping: user.shopping })
    )
    .catch(err => next(err));

exports.updateShopping = (req, res, next) => {
  const { shopping } = req.body;

  User.findOneAndUpdate(
    { _id: req.userId },
    { $set: { shopping } },
    { new: true }
  )
    .populate(populate)
    .exec()
    .then(user =>
      res
        .status(200)
        .json({ message: "Updated shopping.", shopping: user.shopping })
    )
    .catch(err => next(err));
};
