const express = require('express');
const Visit = require('../models/visitcount');
const router = express.Router();

router.get('/visits', async (req, res) => {
  try {
    const visits = await Visit.find();
    console.log("Visits Data from MongoDB:", visits); // Log the visits data to the console
    res.json(visits);
  } catch (err) {
    console.error("Error fetching visits data:", err.message); // Log the error message to the console
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
