const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  dishId: { type: String, required: true, unique: true },
  dishName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isPublished: { type: Boolean, required: true }
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
