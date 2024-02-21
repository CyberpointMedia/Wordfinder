// route/pages.js
const express = require("express");
const Section = require("../models/section");
const Page = require("../models/pages");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const router = express.Router();
const { parse } = require('node-html-parser');
const wrapAsync = require("../middleware/wrapAsync");

// Use middleware to parse JSON and URL-encoded form data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", wrapAsync(async (req, res) => {
  try {
    // Fetch pages from the database
    const pages = await Page.find();

    // Fetch sections for each page
    const pagesWithSections = await Promise.all(
      pages.map(async (page) => {
        const sections = await Section.find({ _id: { $in: page.sections } });
        return { ...page.toObject(), sections };
      })
    );

    // Render the pages.ejs file and pass the "pages" variable
    res.render("section/pages", { pages: pagesWithSections });
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).send("Internal Server Error");
  }
}));

// Home page
router.get("/create", wrapAsync(async (req, res) => {
  try {
    // Fetch sections for the dropdown
    const sections = await Section.find();

    // Fetch pages for any additional data you might need
    const pages = await Page.find();

    res.render("section/create-pages.ejs", { page: {}, sections, pages });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
}));


// Create a new page with sections
router.post("/create", wrapAsync(async (req, res) => {
  console.log("Form Data:", req.body);
  try {
    const {
      page_name,
      sections,
      content,
      seoTitle,
      seoMetaDescription,
      searchEngines,
      'hs-radio-group': hsRadioGroup,
      metaRobots,
      breadcrumbsTitle,
      canonicalURL,
    } = req.body;

    // Ensure that sections is an array before attempting to map over it
    let cleanedSections = Array.isArray(sections) ? sections : [];

    // If sections is a string, attempt to parse it as JSON
    if (typeof sections === 'string') {
      try {
        const parsedSections = JSON.parse(sections);
        if (Array.isArray(parsedSections)) {
          cleanedSections = parsedSections;
        }
      } catch (error) {
        console.error("Error parsing sections string:", error);
      }
    }

    // Convert section IDs to ObjectId
    const sectionObjectIds = cleanedSections.map(sectionId => {
      try {
        return new ObjectId(sectionId);
      } catch (error) {
        console.error("Error converting section ID to ObjectId:", error);
        return null;
      }
    }).filter(Boolean);

    const newPage = new Page({
      page_name,
      content,
      sections: sectionObjectIds,
      seoTitle,
      metaDescription: seoMetaDescription,
      searchEngines,
      hsRadioGroup,
      metaRobots,
      breadcrumbsTitle,
      canonicalURL,
    });

    // Save the page to get its ID
    const savedPage = await newPage.save();
    console.log("Saved Page:", savedPage);

    res.redirect("/admin/pages/create"); // Redirect to the pages route after creating the page
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}));

router.get('/:page_name', wrapAsync(async (req, res) => {
  res.render('section/show-page.ejs');
}));

module.exports = router;
