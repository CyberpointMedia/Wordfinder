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
  visitDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Visit', visitSchema);
