const mongoose = require('mongoose');
const Visit = require('../models/visitcount.js'); // Adjust the path as per your project structure

async function generateData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/wordfinder', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const paths = ['/home', '/about', '/contact', '/products', '/services'];
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => i);

    for (const path of paths) {
      const visitCount = Math.floor(Math.random() * 100);
      const newUserCount = Math.floor(Math.random() * visitCount);

      const newUserCountPerMonth = months.reduce((acc, month) => {
        acc.set(month.toString(), Math.floor(Math.random() * 10));
        return acc;
      }, new Map());

      const newUserCountPerDay = Array.from({ length: 30 }, (_, i) => i + 1).reduce((acc, day) => {
        acc.set(day.toString(), Math.floor(Math.random() * 10));
        return acc;
      }, new Map());

      const visit = new Visit({
        path,
        visitCount,
        newUserCount,
        newUserCountPerMonth,
        newUserCountPerDay,
        visitDate: new Date(currentYear, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      });

      await visit.save();
    }
    console.log('Random data generated and saved to MongoDB.');
  } catch (err) {
    console.error('Error generating data:', err);
  } finally {
    mongoose.disconnect();
  }
}
generateData();
