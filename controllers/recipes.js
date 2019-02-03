const io = require("../middleware/socket");

const Recipe = require("../models/recipe");
const Comment = require("../models/comment");
const Ingredient = require("../models/ingredient");

const PER_PAGE = 5;

const populateFullRecipe = [
  {
    path: "comments",
    select: "content createdAt",
    populate: { path: "creator", select: "name" }
  },
  {
    path: "ratings",
    select: "rating"
  },
  {
    path: "ingredients.ingredient",
    select: "name"
  }
];

const assembleQuery = req => {
  let query;
  if (req.query.userId) {
    query = { creator: req.query.userId };
  } else if (req.query.q) {
    query = {
      $or: [
        { title: { $regex: req.query.q, $options: "i" } }
        //TODO: INCLUDE POPULATED INGREDIENTS IN QUERY
      ]
    };
  }

  return query;
};

exports.getRecipes = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const query = assembleQuery(req);

  const totalItems = await Recipe.find(query).countDocuments();

  const recipes = await Recipe.find(query)
    .populate("ratings", "rating")
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * PER_PAGE)
    .limit(PER_PAGE);

  return res.status(200).json({
    message: "Fetched recipes.",
    recipes,
    totalItems,
    itemsPerPage: PER_PAGE
  });
};

exports.createRecipe = async (req, res, next) => {
  const ingredients = await Promise.all(
    req.body.ingredients.map(item =>
      Ingredient.findOne({
        name: { $regex: item.ingredient, $options: "i" }
      }).then(ingredient => ({
        quantity: item.quantity,
        measurement: item.measurement,
        ingredient
      }))
    )
  );

  new Recipe({
    title: req.body.title,
    image: req.body.image,
    instructions: req.body.instructions,
    ingredients,
    notes: req.body.notes,
    creator: req.userId
  })
    .save()
    .then(recipe => {
      const response = {
        message: "Created recipe.",
        recipe
      };

      io.getIO().emit("recipes", {
        action: "create",
        ...response
      });

      return res.status(201).json(response);
    })
    .catch(err => next(err));
};

exports.getRecipe = (req, res, next) =>
  Recipe.findById(req.params.recipeId)
    .populate(populateFullRecipe)
    .then(recipe => {
      if (!recipe) {
        const error = new Error("Could not find recipe.");
        error.statusCode = 404;
        throw error;
      }
      return res.status(200).json({ message: "Fetched recipe.", recipe });
    })
    .catch(err => next(err));

exports.updateRecipe = (req, res, next) => {
  const { title, image, instructions, ingredients, notes } = req.body;

  Recipe.findOneAndUpdate(
    { _id: req.params.recipeId },
    { $set: { title, image, instructions, ingredients, notes } },
    { new: true }
  )
    .populate(populateFullRecipe)
    .exec()
    .then(recipe => {
      const response = { message: "Updated recipe.", recipe };
      io.getIO().emit("recipes", {
        action: "update",
        ...response
      });
      return res.status(200).json(response);
    })
    .catch(err => next(err));
};

exports.deleteRecipe = async (req, res, next) => {
  try {
    await Recipe.findOneAndDelete({ _id: req.params.recipeId }).exec();
    await Comment.deleteMany({ recipeId: req.params.recipeId }).exec();

    const response = {
      message: "Deleted recipe.",
      recipeId: req.params.recipeId
    };

    io.getIO().emit("recipes", { action: "delete", ...response });
    return res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
