// middleware/visitCounter.js
const Visit = require('../models/visitcount');

module.exports = async (req, res, next) => {
  try {
    let visit = await Visit.findOne({ path: req.path });
  
    if (!visit) {
      visit = new Visit({ path: req.path });
    }
  
    visit.visitCount++;
    visit.newUserCount++;
  
    // Update newUserCountPerMonth
    const month = new Date().getMonth();
    visit.newUserCountPerMonth.set(month.toString(), (visit.newUserCountPerMonth.get(month.toString()) || 0) + 1);
  
    // Update newUserCountPerDay
    const day = new Date().getDate();
    visit.newUserCountPerDay.set(day.toString(), (visit.newUserCountPerDay.get(day.toString()) || 0) + 1);
  
    visit.visitDate = Date.now();
  
    await visit.save();
    next();
  } catch (err) {
    console.error('Error in visit counter middleware:', err);
    next(err); // Pass error to Express error handler
  }
};
