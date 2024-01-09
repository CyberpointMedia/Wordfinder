// route/pages.js
const express = require('express');
const Section = require('../models/section');
const Page = require('../models/pages');
const mongoose = require('mongoose');  
const router = express.Router();



router.get('/', async (req, res) => {
    try {
        // Fetch pages from the database
        const pages = await Page.find();

        // Fetch sections for each page
        const pagesWithSections = await Promise.all(pages.map(async (page) => {
            const sections = await Section.find({ _id: { $in: page.sections } });
            return { ...page.toObject(), sections };
        }));

        // Render the pages.ejs file and pass the "pages" variable
        res.render('section/pages', { pages: pagesWithSections });
    } catch (error) {
        console.error('Error fetching pages:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Home page
router.get('/create', async(req, res) => {
    const pages = await Page.find();

    res.render('section/create-pages.ejs',{ pages }); // Replace 'home' with the actual EJS file for your home page
});

// Create a new page with sections
router.post('/create', async (req, res) => {
    try {
        const { page_name } = req.body;
        const newPage = new Page({ page_name });

        // Save the page to get its ID
        const savedPage = await newPage.save();

        // Create sections if provided
        if (req.body.sections && Array.isArray(req.body.sections)) {
            const sections = req.body.sections.map(sectionTitle => ({
                title: sectionTitle,
            }));

            // Save the sections and add their IDs to the page's sections array
            const savedSections = await Section.create(sections);
            savedPage.sections = savedSections.map(section => section._id);
        }

        // Save the updated page
        await savedPage.save();

        res.redirect('/pages'); // Redirect to the pages route after creating the page
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/delete/:id', async (req, res) => {
    try {
        const pageId = req.params.id;

        // Find the page by ID
        const page = await Page.findById(pageId);

        if (!page) {
            // Page not found
            res.status(404).send('Page not found');
            return;
        }

        // Delete the page
        await Page.findByIdAndDelete(pageId);

        // Redirect to the pages route after successful deletion
        res.redirect('/pages');
    } catch (error) {
        console.error('Error deleting page:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/:pageId', async (req, res) => {
    try {
        console.log(req.params);
        const pageId = req.params.pageId;

        if (!pageId) {
            // Page ID is missing
            res.status(400).send('Page ID is missing');
            return;
        }


        // Find the page by ID and populate its sections
        const page = await Page.findOne({ page_name: pageId }).populate('sections');

        if (!page) {
            // Page not found
            res.status(404).send('Page not found');
            return;
        }
        const allSections = await Section.find();
        // Render the sections.ejs file and pass the "page" variable
        res.render('section/view-page', { page , allSections});
    } catch (error) {
        console.error('Error fetching sections:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Assuming you have a route for viewing sections on a page
router.get('/view/:pageId', async (req, res) => {
    try {
      const pageId = req.params.pageId;
  
      // Fetch the page with associated sections
      const page = await Page.findById(pageId).populate('sections');
  
      // Fetch all available sections
      const allSections = await Section.find();
  
      // Render the view with page and section information
      res.render('view-page', { page, allSections });
    } catch (error) {
      console.error('Error fetching page or sections:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  // Assuming you have a route to handle adding sections to a page
router.post('/add-section/:pageId', async (req, res) => {
    try {
      const pageId = req.params.pageId;
      const selectedSections = req.body.sections;
  
      // Update the page with the selected sections
      await Page.findByIdAndUpdate(pageId, { $addToSet: { sections: selectedSections } });
      console.log('Request Body:', req.body);
      console.log('Page ID from Params:', req.params.pageId);
        // Fetch the updated page with sections
        const updatedPage = await Page.findById(pageId).populate('sections');

        // Fetch all available sections
        const allSections = await Section.find();

        // Render the view-page.ejs with the updated page and sections
        res.render('section/view-page.ejs', { page: updatedPage, allSections });
        } catch (error) {
      console.error('Error adding sections to page:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  // Assuming you have a route to handle removing sections from a page
router.delete('/remove-section/:pageId/:sectionId', async (req, res) => {
    console.log('Request method:', req.method);
    try {
      const { pageId, sectionId } = req.params;
  
      // Update the page by removing the specified section
      await Page.findByIdAndUpdate(pageId, { $pull: { sections: sectionId } });
  
      const updatedPage = await Page.findById(pageId).populate('sections');

        // Fetch all available sections
        const allSections = await Section.find();

        // Render the view-page.ejs with the updated page and sections
        res.render('section/view-page.ejs', { page: updatedPage, allSections });
    } catch (error) {
      console.error('Error removing section from page:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  router.post('/update-section-order', async (req, res) => {
    try {
      const { pageId, sectionOrder } = req.body;
  
      // Update the page with the new section order
      await Page.findByIdAndUpdate(pageId, { $set: { sections: sectionOrder } });
  
      res.json({ success: true, message: 'Section order updated successfully' });
    } catch (error) {
      console.error('Error updating section order:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });
  
module.exports = router;
