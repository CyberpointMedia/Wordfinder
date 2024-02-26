//routes/section.js
const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const Section = require('../models/section');
const Page = require('../models/pages');
const { parse } = require('node-html-parser');
const wrapAsync = require('../middleware/wrapAsync');
const router = express.Router();

const methodOverride = require('method-override');
router.use(methodOverride('_method'));
// const path = require('path');
// router.use('/uploads', express.static(path.join(__dirname, 'uploads')));// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    const filename = Date.now() + '-' + file.originalname.replace(/\s/g, '_'); // Replace spaces with underscores
    cb(null, filename); // Generate a unique filename for the uploaded file
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit file size to 2 MB
  },
}).single('picture__input');

router.route('/create')
  .get(wrapAsync(async (req, res) => {
    try {
      // Render the create-section.ejs view without passing a specific page
      res.render('section/create-section.ejs');
    } catch (error) {
      console.error('Error rendering create-section view:', error);
      res.status(500).send('Internal Server Error');
    }
  }))
  .post(upload, wrapAsync(async (req, res) => {
    try {
      const { title, subHeading, image, imagePosition, content, status } = req.body;

      // Check if an image was uploaded
      console.log(req.body); // Log the uploaded file
      if (!req.file) {
        res.status(400).send('No image uploaded');
        return;
      }
      // Get the path of the uploaded file
      const imagePath = req.file.filename;
      const newSection = new Section({
        title,
        subHeading,
        image: imagePath,
        imagePosition,
        content,
        status,
      });

      // Save the section to the database
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
        const sections = await Section.find();  // Assuming you want to fetch all sections
        res.render('section/section', { sections });
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
      res.render('section/show-section', { section });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

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
  
      console.log({ message: 'Section status updated successfully' });
      res.redirect("/admin/section/show");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.get('/all', wrapAsync(async (req, res) => {
  try {
      const sections = await Section.find();  // Assuming you want to fetch all sections
      res.render('section/section', { sections });
  } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).send('Internal Server Error');
  }
}));
router.get('/published', wrapAsync(async (req, res) => {
  try {
      const sections = await Section.find({ status: 'Published' });  // Assuming you want to fetch all sections
      res.render('section/section', { sections });
  } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).send('Internal Server Error');
  }
}));
router.get('/trash', wrapAsync(async (req, res) => {
  try {
      const sections = await Section.find({ status: 'Trash' });  // Assuming you want to fetch all sections
      res.render('section/section', { sections });
  } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).send('Internal Server Error');
  }
}));
router.get('/draft', wrapAsync(async (req, res) => {
  try {
      const sections = await Section.find({ status: 'Draft' });  // Assuming you want to fetch all sections
      res.render('section/section', { sections });
  } catch (error) {
      console.error('Error fetching pages:', error);
      res.status(500).send('Internal Server Error');
  }
}));

// Edit section
router.get("/edit/:id", wrapAsync(async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the section from the database
    const section = await Section.findById(id);

    // Render the edit-section.ejs file and pass the section
    res.render("section/edit-section.ejs", { section });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
}));
// Update a section
router.post("/edit/:id", upload, wrapAsync(async (req, res) => {
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
      imagePath = req.file.filename; // Get the path of the uploaded file
    }

    // Update the section
    const updatedSection = await Section.findByIdAndUpdate(id, {
      title,
      subHeading,
      image: imagePath, // Update the image field with the path of the uploaded file
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