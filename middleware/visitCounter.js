// middleware/visitCounter.js
const Visit = require('../models/visitcount');

module.exports = async (req, res, next) => {
  const visit = await Visit.findOne({ path: req.path }) || new Visit({ path: req.path });
  visit.visitCount++;
  await visit.save();
  next();
};