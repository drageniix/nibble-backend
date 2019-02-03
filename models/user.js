const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    privilege: {
      type: Number,
      default: 0
    },
    pantry: [
      {
        quantity: Number,
        measurement: String,
        ingredient: {
          type: Schema.Types.ObjectId,
          ref: "Ingredient"
        }
      }
    ],
    shoppingList: [
      {
        quantity: Number,
        measurement: String,
        ingredient: {
          type: Schema.Types.ObjectId,
          ref: "Ingredient"
        }
      }
    ],
    menu: [
      {
        day: Date,
        type: Number,
        order: Number,
        recipe: {
          type: Schema.Types.ObjectId,
          ref: "Recipe"
        }
      }
    ],
    savedRecipes: [
      //TODO: Save Recipes
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
