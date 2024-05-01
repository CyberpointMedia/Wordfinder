// models/section/categories
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  description: {
    type: String
  }
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
