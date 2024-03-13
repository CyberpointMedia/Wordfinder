//router/footer.js
const express = require('express');
const Footer = require('../models/footer'); // Update the import statement
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
        cb(null, {fieldName: file.fieldname});
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
    const footers = await Footer.find({});
    res.render('appearance/widgets', { user: req.user, footers: footers }); 
});
router.post('/save', async (req, res) => {
  const { draggableId,droppableId,  name, customhtml, contactdetails, image } = req.body;
  try {
    // Find the footer document
    const footer = await Footer.findOne();
    console.log("droppableId: ", droppableId);
    if (!footer) {
      return res.status(404).send('Footer not found');
    }
    // Create the widget
const widget = { name, customhtml, contactdetails, image };
// Check if the footer[draggableId] array exists
if (!footer[draggableId]) {
  footer[draggableId] = [];
}
// Add the widget to the correct column
footer[draggableId].push(widget);
    // Save the changes
    await footer.save();
    res.send('Data saved successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// Save widgets
router.post('/saveWidgets', async (req, res) => {
  console.log('req.body:', req.body);
  try {
    const { footerCol1, footerCol2, footerCol3, footerCol4 } = req.body;

    // Parse the arrays from strings to arrays of widgets
    const parsedFooterCol1 = footerCol1 ? JSON.parse(footerCol1) : [];
    const parsedFooterCol2 = footerCol2 ? JSON.parse(footerCol2) : [];
    const parsedFooterCol3 = footerCol3 ? JSON.parse(footerCol3) : [];
    const parsedFooterCol4 = footerCol4 ? JSON.parse(footerCol4) : [];

    console.log('parsedFooterCol1:', parsedFooterCol1);
    console.log('parsedFooterCol2:', parsedFooterCol2);
    console.log('parsedFooterCol3:', parsedFooterCol3);
    console.log('parsedFooterCol4:', parsedFooterCol4);

    // Find the existing Footer document
    const footer = await Footer.findOne();
    if (!footer) {
      return res.status(404).send('Footer not found');
    }

    // Update the footer columns
    footer.footerCol1 = parsedFooterCol1;
    footer.footerCol2 = parsedFooterCol2;
    footer.footerCol3 = parsedFooterCol3;
    footer.footerCol4 = parsedFooterCol4;

    // Save the document to the database
    await footer.save();

    // Send a success response
    res.redirect('/footer/widgets');
  } catch (error) {
    console.error('Error saving widgets:', error);
    // Send an error response
    res.status(500).json({ message: 'An error occurred while saving the widgets.', error });
  }
});

// Create a new footer
router.post('/create', (req, res) => {
    const footer = new Footer({
        name: req.body.name
    });

    footer.save()
        .then(() => res.redirect('/footer/widgets'))
        .catch(err => res.status(500).send(err.message));
});

router.post('/Customhtml', (req, res) => {
    const footer = new Footer({
        Customhtml: req.body.Customhtml // Update property name
    });

    footer.save()
        .then(() => res.redirect('/footer/widgets'))
        .catch(err => res.status(500).send(err.message));
});

router.post('/contactdetails', async (req, res) => {
    const footer = new Footer({
        contactdetails: req.body.contactdetails // Update property name
    });

    footer.save()
        .then(() => res.redirect('/footer/widgets'))
        .catch(err => res.status(500).send(err.message));
});
// Create a new footer with image URL
router.post('/image', upload.single('image'), async (req, res) => {
    const footer = new Footer({
        image: req.file.location
    });

    try {
        await footer.save();
        res.redirect('/footer/widgets');
    } catch (err) {
        console.error(err);
        res.redirect('/widgets');
    }
});
module.exports = router;
