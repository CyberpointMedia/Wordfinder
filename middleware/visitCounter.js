// middleware/visitCounter.js
const Visit = require('../models/visitcount');

module.exports = async (req, res, next) => {
  let visit = await Visit.findOne({ path: req.path });
  if (!visit) {
    visit = new Visit({ path: req.path });
  }
  visit.visitCount++;
  visit.newUserCount++;

  visit.newUserCountPerMonth = visit.newUserCountPerMonth || {};
  const month = new Date().getMonth();
  if (visit.newUserCountPerMonth[month]) {
    visit.newUserCountPerMonth[month]++;
  } else {
    visit.newUserCountPerMonth[month] = 1;
  }

  visit.newUserCountPerDay = visit.newUserCountPerDay || {};
  const day = new Date().getDate();
  if (visit.newUserCountPerDay[day]) {
    visit.newUserCountPerDay[day]++;
  } else {
    visit.newUserCountPerDay[day] = 1;
  }

  visit.visitDate = Date.now();
  await visit.save();
  next();
};