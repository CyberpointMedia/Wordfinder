// models/visitcount.js
const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  path: String,
  visitCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Visit', visitSchema);