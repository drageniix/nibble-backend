const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeScheme = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    image: String,
    instructions: [String],
    ingredients: [
      {
        quantity: Number,
        measurement: String,
        ingredient: {
          type: Schema.Types.ObjectId,
          ref: "Ingredient"
        }
      }
    ],
    notes: String,
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    ratings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rating"
      }
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeScheme);
