const mongoose = require('mongoose');

const userActivitySchema = new mongoose.Schema({
  username: String,
  ip: String,
  location: String, // You can use a library like geoip-lite to get the location from the IP address
  action: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserActivity', userActivitySchema);