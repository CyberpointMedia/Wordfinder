//router/footer.js
const express = require('express');
const Footer = require('../models/footer');
const Widget = require('../models/widget');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const wrapAsync = require('../middleware/wrapAsync');
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
router.get('/widgets', ensureAdmin, wrapAsync(async (req, res) => { 
  const widget = await Widget.findOne();
  const footers = await Footer.find({}).populate('footerCol1 footerCol2 footerCol3 footerCol4 footerCol5').populate('footerCol1.widgets footerCol2.widgets footerCol3.widgets footerCol4.widgets footerCol5.widgets');
  console.log('Footers:', footers); // Log footers data

  const widgets = await Widget.find({});
  console.log('Widgets:', widgets); // Log widgets data

  const columns = ['footerCol1', 'footerCol2', 'footerCol3', 'footerCol4', 'footerCol5'];

  // Create an array of widget objects that include the selected column
  const widgetsWithColumn = widgets.map(widget => ({ ...widget._doc, column: widget.column }));

  res.render('appearance/widgets', { user: req.user, footers: footers, widgets: widgetsWithColumn, columns: columns ,widget: widget}); 
}));

router.post('/addtexteditor', wrapAsync(async (req, res) => {
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

  res.redirect('/footer/widgets?message=Text Editor Widget added successfully');
}));

router.post('/addcustomhtml', wrapAsync(async (req, res) => {
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
  res.redirect('/footer/widgets?message=Custom HTML Widget added successfully');
}));

router.post('/addcontactdetails', wrapAsync(async (req, res) => {
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

  res.redirect('/footer/widgets?message=Contact Details Widget added successfully');
}));

router.post('/addimage', wrapAsync(async (req, res) => {
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

  res.redirect('/footer/widgets?message=Image Widget added successfully');
}));

router.post('/texteditor', wrapAsync(async (req, res) => {
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
    
    res.redirect('/footer/widgets?message=Text Editor Widget added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
}));

router.post('/Customhtml', wrapAsync(async (req, res) => {
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
    
    res.redirect('/footer/widgets?message=Custom HTML Widget added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
}));

router.post('/contactdetails', wrapAsync(async (req, res) => {
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
    
    res.redirect('/footer/widgets?message=Contact Details Widget added successfully');
  } catch (err) {
    res.status(500).send(err.message);
  }
}));

// Create a new footer with image URL
router.post('/image', upload.single('image'), wrapAsync(async (req, res) => {
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
    
    res.redirect('/footer/widgets?message=Image Widget added successfully');
  } catch (err) {
    console.error(err);
    res.redirect('/footer/widgets');
  }
}));

//GTM google tag widgets
router.post('/save-gtm-url', wrapAsync(async (req, res) => {
  const { gtmUrl } = req.body;

  try {
    await Widget.findOneAndUpdate({}, { gtmUrl: gtmUrl }, { upsert: true, new: true });
    res.redirect('/footer/widgets?message=GTM URL Widget added successfully');
  } catch (error) {
    res.status(500).send('Error saving GTM URL');
  }
}));

// Save GTM data
router.post('/save-gtm-data', wrapAsync(async (req, res) => {
  const { gtmHead, gtmBody } = req.body;

  try {
      await Widget.findOneAndUpdate({}, { gtmHead: gtmHead, gtmBody: gtmBody }, { upsert: true, new: true });
      res.redirect('/footer/widgets?message=GTM data Widget added successfully');
  } catch (error) {
      res.status(500).send('Error saving GTM data');
  }
}));
// Delete a widget
router.post('/delete/:id', wrapAsync(async (req, res) => {
  try {
    console.log('Deleting widget'); // Log the widget id
      // Find the widget by id and delete it
      await Widget.findByIdAndDelete(req.params.id);

      // Redirect to the widgets page
      res.redirect('/footer/widgets?message=Widgets delete successfully');
  } catch (err) {
      res.status(500).send(err.message);
  }
}));

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).render('not-found/page-not-found.ejs');
});

module.exports = router;
