const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  visitCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Visit', visitSchema);
