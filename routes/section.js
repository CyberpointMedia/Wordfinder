//routes/section.js
const express = require('express');
const Jimp = require('jimp');
const Section = require('../models/section');
const Page = require('../models/pages');
const { parse } = require('node-html-parser');
const wrapAsync = require('../middleware/wrapAsync');
const router = express.Router();
const { S3Client } = require("@aws-sdk/client-s3");
const multer = require('multer');
const multerS3 = require('multer-s3');
require('dotenv').config();

const methodOverride = require('method-override');
router.use(methodOverride('_method'));

// Set up AWS S3
const s3 = new S3Client({
  region: process.env.AWS_REGION,
    credentials: {
    accessKeyId: process.env.YOUR_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.YOUR_AWS_SECRET_ACCESS_KEY
  }
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.YOUR_BUCKET_NAME,
    // acl: 'public-read', // files in the bucket are public
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
});

router.route('/create')
  .get(wrapAsync(async (req, res) => {
    try {
      // Render the create-section.ejs view without passing a specific page
      res.render('section/create-section.ejs',{user: req.user});
    } catch (error) {
      console.error('Error rendering create-section view:', error);
      res.status(500).send('Internal Server Error');
    }
  }))
  .post(upload.single('picture__input'), wrapAsync(async (req, res) => {
    try {
      const { title, subHeading, imagePosition, content, status } = req.body;
      console.log(req.body);
      // req.file.location contains the image URL
      const image = req.file ? req.file.location : null;
      const newSection = new Section({
        title,
        subHeading,
        image,
        imagePosition,
        content,
        status,
      });
      console.log("newsection",newSection);
      await newSection.save();
  
      res.redirect('/admin/section/create');
    } catch (error) {
      console.error('Error creating section:', error);
      res.status(500).send('Internal Server Error');
    }
  }));
// Display all pages with associated sections
router.get('/show', wrapAsync(async (req, res) => {
    try {
      const allCount = await Section.countDocuments();
      const publishedCount = await Section.countDocuments({ status: 'Published' });
      const trashCount = await Section.countDocuments({ status: 'Trash' });
      const draftCount = await Section.countDocuments({ status: 'Draft' });
        const sections = await Section.find({ status: { $in: ['Published', 'Draft'] } });  // Assuming you want to fetch all sections
        res.render('section/section', { sections , user: req.user , allCount, publishedCount, trashCount, draftCount});
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).send('Internal Server Error');
    }
}));
router.get('/show/:title', async (req, res) => {
  try {
      // Fetch the section from your database using req.params.title
      const section = await Section.findOne({ title: req.params.title });
      // Render the show-section.ejs view with the updated section
      console.log(section);
      res.render('section/show-section', { section ,user: req.user});
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

router.get('/all', wrapAsync(async (req, res) => {
  try {
    const allCount = await Section.countDocuments();
    const publishedCount = await Section.countDocuments({ status: 'Published' });
    const trashCount = await Section.countDocuments({ status: 'Trash' });
    const draftCount = await Section.countDocuments({ status: 'Draft' });
      const sections = await Section.find({ status: { $in: ['Published', 'Draft'] }});  // Assuming you want to fetch all sections
      res.render('section/section', { sections ,user: req.user , allCount, publishedCount, trashCount, draftCount});
  } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).send('Internal Server Error');
  }
}));
router.get('/published', wrapAsync(async (req, res) => {
  try {
    const allCount = await Section.countDocuments();
    const publishedCount = await Section.countDocuments({ status: 'Published' });
    const trashCount = await Section.countDocuments({ status: 'Trash' });
    const draftCount = await Section.countDocuments({ status: 'Draft' });
      const sections = await Section.find({ status: 'Published' });  // Assuming you want to fetch all sections
      res.render('section/section', { sections ,user: req.user , allCount, publishedCount, trashCount, draftCount});
  } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).send('Internal Server Error');
  }
}));
router.get('/trash', wrapAsync(async (req, res) => {
  try {
    const allCount = await Section.countDocuments();
    const publishedCount = await Section.countDocuments({ status: 'Published' });
    const trashCount = await Section.countDocuments({ status: 'Trash' });
    const draftCount = await Section.countDocuments({ status: 'Draft' });
      const sections = await Section.find({ status: 'Trash' });  // Assuming you want to fetch all sections
      res.render('section/section', { sections ,user: req.user , allCount, publishedCount, trashCount, draftCount});
  } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).send('Internal Server Error');
  }
}));
router.get('/draft', wrapAsync(async (req, res) => {
  try {
    const allCount = await Section.countDocuments();
    const publishedCount = await Section.countDocuments({ status: 'Published' });
    const trashCount = await Section.countDocuments({ status: 'Trash' });
    const draftCount = await Section.countDocuments({ status: 'Draft' });
      const sections = await Section.find({ status: 'Draft' });  // Assuming you want to fetch all sections
      res.render('section/section', { sections ,user: req.user , allCount, publishedCount, trashCount, draftCount});
  } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).send('Internal Server Error');
  }
}));
  // Assuming you have an endpoint for updating the page status
  router.put('/update-status/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const section = await Section.findById(id);
      if (!section) {
        return res.status(404).json({ error: 'Section not found' });
      }
  
      section.status = status;
      await section.save();
  
      res.json({ message: 'Section status updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  router.delete('/delete/:id', async (req, res) => {
    try {
        console.log('Delete Section:', req.params.id);
        await Section.findByIdAndDelete(req.params.id);
        res.redirect('/admin/section/trash');
    } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).send('Internal Server Error');
    }
  });

// Edit section
router.get("/edit/:id", wrapAsync(async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the section from the database
    const section = await Section.findById(id);

    // Render the edit-section.ejs file and pass the section
    res.render("section/edit-section.ejs", { section , user: req.user});
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
}));

// Update a section
router.post("/edit/:id", upload.single('picture__input'), wrapAsync(async (req, res) => {
  const { id } = req.params;
  console.log("Form Data:", req.body);
  try {
    const {
      title,
      subHeading,
      imagePosition,
      content,
      status
    } = req.body;

    // Check if an image was uploaded
    let imagePath;
    if (req.file) {
      imagePath = req.file.location; // Get the URL of the uploaded file
    }

    // Update the section
    const updatedSection = await Section.findByIdAndUpdate(id, {
      title,
      subHeading,
      image: imagePath, // Update the image field with the URL of the uploaded file
      imagePosition,
      content,
      status
    }, { new: true });

    console.log("Updated Section:", updatedSection);

    res.redirect("/admin/section/show"); // Redirect to the sections route after updating the section
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}));

module.exports = router;