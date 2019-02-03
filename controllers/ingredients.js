const Ingredient = require("../models/ingredient");

exports.postIngredient = (req, res, next) =>
  new Ingredient({ name: req.body.name })
    .save()
    .then(ingredient =>
      res.status(200).json({ message: "Created ingredient.", ingredient })
    )
    .catch(err => next(err));
