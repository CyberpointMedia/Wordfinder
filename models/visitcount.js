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
  newUserCount: {
    type: Number,
    default: 0,
  },
  newUserCountPerMonth: {
    type: Map,
    of: Number,
    default: {}
  },
  newUserCountPerDay: {
    type: Map,
    of: Number,
    default: {}
  },
  visitDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Visit', visitSchema);
