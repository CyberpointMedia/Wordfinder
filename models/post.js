// models/post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  features: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Published', 'Trash', 'Draft'],
    default: 'Draft', // Set the default status as Draft
},
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Post', postSchema);