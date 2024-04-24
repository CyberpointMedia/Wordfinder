//middleware/user-activity.js
const UserActivity = require('../models/user-activity');
const geoip = require('geoip-lite');

function logUserActivity(action) {
  return function(req, res, next) {
    const ip = req.ip;
    const geo = geoip.lookup(ip);

    const userActivity = new UserActivity({
      username: req.user ? req.user.username : 'Guest',
      ip: ip,
      location: geo ? `${geo.city}, ${geo.region}, ${geo.country}` : 'Unknown',
      action: action
    });
    userActivity.save().then(() => next());
  }
}

module.exports = logUserActivity;