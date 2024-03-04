// models/post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  heading: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  feature_img: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Published', 'Trash', 'Draft'],
    default: 'Draft', // Set the default status as Draft
},
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
});

module.exports = mongoose.model('Post', postSchema);