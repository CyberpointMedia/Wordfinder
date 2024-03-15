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
  const footers = await Footer.find({}).populate('footerCol1 footerCol2 footerCol3 footerCol4').populate('footerCol1.widgets footerCol2.widgets footerCol3.widgets footerCol4.widgets');
  console.log('Footers:', footers); // Log footers data

  const widgets = await Widget.find({});
  console.log('Widgets:', widgets); // Log widgets data

  const columns = ['footerCol1', 'footerCol2', 'footerCol3', 'footerCol4'];

  // Create an array of widget objects that include the selected column
  const widgetsWithColumn = widgets.map(widget => ({ ...widget._doc, column: widget.column }));

  res.render('appearance/widgets', { user: req.user, footers: footers, widgets: widgetsWithColumn, columns: columns }); 
});


router.post('/addtexteditor', async (req, res) => {
  // The column where the widget should be added
  const column = req.body.column;
  
  // Create the widget
  const widget = new Widget({
    name: 'Text Editor',
    column: column,
    // Add other widget fields here
  });
  await widget.save();
  let footer = await Footer.findOne(); // try to find an existing footer
  if (!footer) {
      footer = new Footer(); // create a new footer if none exists
  }
  footer[column].push(widget._id);
  await footer.save();

  res.redirect('/footer/widgets');
});

router.post('/addcustomhtml', async (req, res) => {
  // The column where the widget should be added
  const column = req.body.column;
  
  // Create the widget
  const widget = new Widget({
    name: 'Custom HTML',
    column: column,
    // Add other widget fields here
  });
  await widget.save();
  let footer = await Footer.findOne(); // try to find an existing footer
  if (!footer) {
      footer = new Footer(); // create a new footer if none exists
  }
  footer[column].push(widget._id);
  await footer.save();

  res.redirect('/footer/widgets');
});
router.post('/addcontactdetails', async (req, res) => {
  // The column where the widget should be added
  const column = req.body.column;
  
  // Create the widget
  const widget = new Widget({
    name: 'Contact Details',
    column: column,
    // Add other widget fields here
  });
  await widget.save();
  let footer = await Footer.findOne(); // try to find an existing footer
  if (!footer) {
      footer = new Footer(); // create a new footer if none exists
  }
  footer[column].push(widget._id);
  await footer.save();

  res.redirect('/footer/widgets');
});

router.post('/addimage', async (req, res) => {
  // The column where the widget should be added
  const column = req.body.column;
  
  // Create the widget
  const widget = new Widget({
    name: 'Image',
    column: column,
    // Add other widget fields here
  });
  await widget.save();
  let footer = await Footer.findOne(); // try to find an existing footer
  if (!footer) {
      footer = new Footer(); // create a new footer if none exists
  }
  footer[column].push(widget._id);
  await footer.save();

  res.redirect('/footer/widgets');
});
router.post('/texteditor', async (req, res) => {
  // The _id of the widget to update
  const widgetId = req.body.widgetId;

  try {
    // Update the widget
    let widget = await Widget.findByIdAndUpdate(widgetId, {
      texteditor: req.body.texteditor,
    }, { new: true });

    // If the widget does not exist, create a new one
    if (!widget) {
      widget = new Widget({
        name: 'Text Editor',
        texteditor: req.body.texteditor,
        // Add other widget fields here
      });
      await widget.save();
    }

    let footer = await Footer.findOne();
    if (!footer) {
        footer = new Footer();
    }
    footer[widget.column].push(widget._id);
    await footer.save();
    
    res.redirect('/footer/widgets');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/Customhtml', async (req, res) => {
  // The _id of the widget to update
  const widgetId = req.body.widgetId;

  try {
    // Update the widget
    let widget = await Widget.findByIdAndUpdate(widgetId, {
      Customhtml: req.body.Customhtml,
    }, { new: true });

    // If the widget does not exist, create a new one
    if (!widget) {
      widget = new Widget({
        name: 'Custom HTML',
        Customhtml: req.body.Customhtml,
        // Add other widget fields here
      });
      await widget.save();
    }

    let footer = await Footer.findOne();
    if (!footer) {
        footer = new Footer();
    }
    footer[widget.column].push(widget._id);
    await footer.save();
    
    res.redirect('/footer/widgets');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post('/contactdetails', async (req, res) => {
  // The _id of the widget to update
  const widgetId = req.body.widgetId;

  try {
    // Update the widget
    let widget = await Widget.findByIdAndUpdate(widgetId, {
      contactdetails: req.body.contactdetails,
    }, { new: true });

    // If the widget does not exist, create a new one
    if (!widget) {
      widget = new Widget({
        name: 'Contact Details',
        contactdetails: req.body.contactdetails,
        // Add other widget fields here
      });
      await widget.save();
    }

    let footer = await Footer.findOne();
    if (!footer) {
        footer = new Footer();
    }
    footer[widget.column].push(widget._id);
    await footer.save();
    
    res.redirect('/footer/widgets');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new footer with image URL
router.post('/image', upload.single('image'), async (req, res) => {
  // The _id of the widget to update
  const widgetId = req.body.widgetId;

  try {
    // Update the widget
    let widget = await Widget.findByIdAndUpdate(widgetId, {
      image: req.file.location,
    }, { new: true });

    // If the widget does not exist, create a new one
    if (!widget) {
      widget = new Widget({
        name: 'Image',
        image: req.file.location,
        // Add other widget fields here
      });
      await widget.save();
    }

    let footer = await Footer.findOne();
    if (!footer) {
        footer = new Footer();
    }
    footer[widget.column].push(widget._id);
    await footer.save();
    
    res.redirect('/footer/widgets');
  } catch (err) {
    console.error(err);
    res.redirect('/footer/widgets');
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
