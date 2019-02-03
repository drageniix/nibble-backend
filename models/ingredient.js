const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
  name: String,
  nutrition: {
    serving: {
      amount: Number,
      measurement: String
    },
    calories: Number,
    fat: {
      total: Number,
      saturated: Number,
      polyunsaturated: Number,
      monounsaturated: Number,
      trans: Number
    },
    cholesterol: Number,
    sodium: Number,
    carbohydrates: {
      total: Number,
      fiber: {
        dietary: Number,
        soluble: Number
      },
      sugar: Number,
      sugarAlcohol: Number
    },
    protein: Number,
    vitamins: [
      {
        name: String,
        amount: Number,
        measurement: String
      }
    ]
  }
});

module.exports = mongoose.model("Ingredient", ingredientSchema);
