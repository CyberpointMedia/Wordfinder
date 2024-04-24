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
  readingTime: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  seoTitle: {
    type: String,
    default: ''
  },
  seoslug: {
    type: String,
    default: ''
  },
  seoMetaDescription: {
    type: String,
    default: ''
  },
  searchEngines: {
    type: String,
    default: ''
  },
  metaRobots: {
    type: String,
    default: ''
  },
  breadcrumbsTitle: {
    type: String,
    default: ''
  },
  canonicalURL: {
    type: String,
    default: ''
  }
}, { timestamps: true }); // Add this line

module.exports = mongoose.model('Post', postSchema);