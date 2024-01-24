// route/pages.js
const express = require("express");
const Section = require("../models/section");
const Page = require("../models/pages");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const router = express.Router();
const { parse } = require('node-html-parser');

// Use middleware to parse JSON and URL-encoded form data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", async (req, res) => {
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
});

// Home page
router.get("/create", async (req, res) => {
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
});

// Create a new page with sections
// Create a new page with sections
// Create a new page with sections
router.post("/create", async (req, res) => {
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
});


router.get("/:pageId", async (req, res) => {
  try {
    console.log(req.params);
    const pageId = req.params.pageId;

    if (!pageId) {
      // Page ID is missing
      res.status(400).send("Page ID is missing");
      return;
    }

    // Find the page by ID and populate its sections
    const page = await Page.findOne({ page_name: pageId }).populate("sections");

    if (!page) {
      // Page not found
      res.status(404).send("Page not found");
      return;
    }
    const allSections = await Section.find();
    // Render the sections.ejs file and pass the "page" variable
    res.render("section/view-page", { page, allSections });
  } catch (error) {
    console.error("Error fetching sections:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Assuming you have a route for viewing sections on a page
router.get("/view/:pageId", async (req, res) => {
  try {
    const pageId = req.params.pageId;

    // Fetch the page with associated sections
    const page = await Page.findById(pageId).populate("sections");

    // Fetch all available sections
    const allSections = await Section.find();

    // Render the view with page and section information
    res.render("view-page", { page, allSections });
  } catch (error) {
    console.error("Error fetching page or sections:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Assuming you have a route to handle adding sections to a page
router.post("/add-section/:pageId", async (req, res) => {
  try {
    const pageId = req.params.pageId;
    const selectedSections = req.body.sections;

    // Update the page with the selected sections
    await Page.findByIdAndUpdate(pageId, {
      $addToSet: { sections: selectedSections },
    });
    console.log("Request Body:", req.body);
    console.log("Page ID from Params:", req.params.pageId);
    // Fetch the updated page with sections
    const updatedPage = await Page.findById(pageId).populate("sections");

    // Fetch all available sections
    const allSections = await Section.find();

    // Render the view-page.ejs with the updated page and sections
    res.render("section/view-page.ejs", { page: updatedPage, allSections });
  } catch (error) {
    console.error("Error adding sections to page:", error);
    res.status(500).send("Internal Server Error");
  }
});
// Assuming you have a route to handle removing sections from a page
router.delete("/remove-section/:pageId/:sectionId", async (req, res) => {
  console.log("Request method:", req.method);
  try {
    const { pageId, sectionId } = req.params;

    // Update the page by removing the specified section
    await Page.findByIdAndUpdate(pageId, { $pull: { sections: sectionId } });

    const updatedPage = await Page.findById(pageId).populate("sections");

    // Fetch all available sections
    const allSections = await Section.find();

    // Render the view-page.ejs with the updated page and sections
    res.render("section/view-page.ejs", { page: updatedPage, allSections });
  } catch (error) {
    console.error("Error removing section from page:", error);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/update-section-order", async (req, res) => {
  try {
    const { pageId, sectionOrder } = req.body;

    // Update the page with the new section order
    await Page.findByIdAndUpdate(pageId, { $set: { sections: sectionOrder } });

    res.json({ success: true, message: "Section order updated successfully" });
  } catch (error) {
    console.error("Error updating section order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
