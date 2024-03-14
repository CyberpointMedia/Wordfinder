//router/footer.js
const express = require('express');
const Footer = require('../models/footer');
const Widget = require('../models/widget');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ensureAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Rest of the code...
// Import necessary modules
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require("@aws-sdk/client-s3");


// Set up AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.YOUR_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.YOUR_AWS_SECRET_ACCESS_KEY
  }
});

// Set up multer
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.YOUR_BUCKET_NAME,
    //acl: 'public-read', // files in the bucket are public
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Render widgets view
router.get('/widgets', ensureAdmin, async (req, res) => { 
  const footers = await Footer.find({}).populate('footerCol1 footerCol2 footerCol3 footerCol4');
  console.log('Footers:', footers); // Log footers data

  const widgets = await Widget.find({});
  console.log('Widgets:', widgets); // Log widgets data

  const columns = ['footerCol1', 'footerCol2', 'footerCol3', 'footerCol4'];
  res.render('appearance/widgets', { user: req.user, footers: footers, widgets: widgets, columns: columns }); 
});

// Create a new widget and add it to a footer
router.post('/create', async (req, res) => {
  // Create a new widget
  const widget = new Widget({
      name: req.body.name,
      column: req.body.column,
      // add other properties of the widget
  });

  try {
      // Save the widget
      await widget.save();

      // Find the footer and add the widget to the selected column
      let footer = await Footer.findOne(); // try to find an existing footer
      if (!footer) {
          footer = new Footer(); // create a new footer if none exists
      }
      footer[req.body.column].push(widget._id);
      await footer.save();

      res.redirect('/footer/widgets');
  } catch (err) {
      res.status(500).send(err.message);
  }
});

router.post('/Customhtml', async(req, res) => {
  // Create a new widget
  const widget = new Widget({
      Customhtml: req.body.Customhtml,
      // add other properties of the widget
  });

  try {
      // Save the widget
      await widget.save();

      // Find the footer and add the widget to the selected column
      const footer = await Footer.findOne(); // assuming there's only one footer
      if (!footer) {
          return res.status(404).send('Footer not found');
      }
      footer[req.body.column].push(widget._id);
      await footer.save();

      res.redirect('/footer/widgets');
  } catch (err) {
      res.status(500).send(err.message);
  }
});
// Create a new widget with contact details and add it to a footer
router.post('/contactdetails', async (req, res) => {
  // Create a new widget
  const widget = new Widget({
      contactdetails: req.body.contactdetails,
      // add other properties of the widget
  });

  try {
      // Save the widget
      await widget.save();

      // Find the footer and add the widget to the selected column
      const footer = await Footer.findOne(); // assuming there's only one footer
      if (!footer) {
          return res.status(404).send('Footer not found');
      }
      footer[req.body.column].push(widget._id);
      await footer.save();

      res.redirect('/footer/widgets');
  } catch (err) {
      res.status(500).send(err.message);
  }
});

// Create a new footer with image URL
router.post('/image', upload.single('image'), async (req, res) => {
   // Create a new widget
   const widget = new Widget({
    image: req.file.location,
    // add other properties of the widget
});

try {
    // Save the widget
    await widget.save();

    // Find the footer and add the widget to the selected column
    const footer = await Footer.findOne(); // assuming there's only one footer
    if (!footer) {
        return res.status(404).send('Footer not found');
    }
    footer[req.body.column].push(widget._id);
    await footer.save();

    res.redirect('/footer/widgets');
} catch (err) {
    console.error(err);
    res.redirect('/widgets');
}
});

router.post('/delete/:id', async (req, res) => {
  try {
      // Find the widget by id and delete it
      await Widget.findByIdAndDelete(req.params.id);

      // Redirect to the widgets page
      res.redirect('/footer/widgets');
  } catch (err) {
      res.status(500).send(err.message);
  }
});
module.exports = router;
