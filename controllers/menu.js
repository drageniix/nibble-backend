const User = require("../models/user");

const populate = {
  path: "menu.recipe",
  select: "title image"
};

exports.getMenu = (req, res, next) =>
  User.findById(req.userId)
    .populate(populate)
    .then(user =>
      res.status(200).json({ message: "Retrieved menu.", pantry: user.pantry })
    )
    .catch(err => next(err));

exports.updateMenu = (req, res, next) => {
  const { menu } = req.body;

  User.findOneAndUpdate({ _id: req.userId }, { $set: { menu } }, { new: true })
    .populate(populate)
    .exec()
    .then(user =>
      res.status(200).json({ message: "Updated menu.", menu: user.menu })
    )
    .catch(err => next(err));
};
