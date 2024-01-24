//routes/section.js
const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const sharp = require('sharp');
const Section = require('../models/section');
const Page = require('../models/pages');
const { parse } = require('node-html-parser');

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store the image in memory
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Limit file size to 2 MB
  },
}).single('picture__input');

const router = express.Router();

router.route('/create')
  .get(async (req, res) => {
    try {
      // Render the create-section.ejs view without passing a specific page
      res.render('section/create-section.ejs');
    } catch (error) {
      console.error('Error rendering create-section view:', error);
      res.status(500).send('Internal Server Error');
    }
  })
  .post(upload, async (req, res) => {  // <-- Adjusted this line
    try {
      const { title, subHeading, image, imagePosition, content, status } = req.body;

      // Check if an image was uploaded
      console.log(req.body); // Log the uploaded file
      if (!req.file) {
        res.status(400).send('No image uploaded');
        return;
      }

      // Assuming you want to use the uploaded file
      const uploadedFile = req.file;

      // Use sharp to resize and convert the image to WebP format
      const resizedImageBuffer = await sharp(uploadedFile.buffer)
        .resize({ width: 800, height: 600 })
        .webp({ quality: 80 })
        .toBuffer();

      const newSection = new Section({
        title,
        subHeading,
        image: resizedImageBuffer.toString('base64'),
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
  });

// Display all pages with associated sections
router.get('/show', async (req, res) => {
    try {
        const sections = await Section.find();  // Assuming you want to fetch all sections
        res.render('section/show-section', { sections });
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/edit/:id', async (req, res) => {
    try {
        const section = await Section.findById(req.params.id);
        if (!section) {
            res.status(404).send('Section not found');
            return;
        }
        res.render('section/edit-section', { section });
    } catch (error) {
        console.error('Error fetching section for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/edit/:id', async (req, res) => {
    console.log('Edit Section POST Request Received');
    console.log('Section ID:', req.params.id);
    console.log('Form Data:', req.body);

    const sectionId = req.params.id;
    const { title, subHeading, image, imagePosition } = req.body;
    
    try {
        // Check if the section exists
        const section = await Section.findById(sectionId);
        if (!section) {
            res.status(404).send('Section not found');
            return;
        }
        // Update the fields in the document based on your schema
        await Section.findByIdAndUpdate(sectionId, { title, subHeading, image, imagePosition });
        res.redirect(`/section/show`);
    } catch (error) {
        console.error('Error updating section:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        await Section.findByIdAndDelete(req.params.id);
        res.redirect('/section/show');
    } catch (error) {
        console.error('Error deleting section:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

























