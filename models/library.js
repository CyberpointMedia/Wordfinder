const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  src: {
    type: String,
    required: true
  },
  uploadedOn: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  filetype: {
    type: String,
    required: true
  },
  filesize: {
    type: String,
    required: true
  },
  dimensions: {
    type: String,
    required: true
  },
  alternativeText: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  fileUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('library', ImageSchema);