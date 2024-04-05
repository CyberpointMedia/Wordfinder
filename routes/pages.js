// route/pages.js
const express = require("express");
const Section = require("../models/section");
const Page = require("../models/pages");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const router = express.Router();
const { parse } = require('node-html-parser');
const wrapAsync = require("../middleware/wrapAsync");
const methodOverride = require('method-override');
const { URL } = require('url');

// Use middleware to parse JSON and URL-encoded form data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride('_method'));
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(404).render('not-found/page-not-found.ejs');
});

const setSEOHeaders = async (req, res, next) => {
  // Fetch the page from the database
  const page = await Page.findOne({ page_name: req.params.page_name });

  if (page) {
    // Set the headers
    res.set('X-SEO-Title', page.seoTitle);
    res.set('X-SEO-Slug', page.seoslug);
    res.set('X-Meta-Description', page.metaDescription);
    res.set('X-Meta-Robots', page.metaRobots.toString());
  }

  next();
};

router.use(setSEOHeaders);

router.get("/", wrapAsync(async (req, res) => {
  try {
    const allCount = await Page.countDocuments();
      const publishedCount = await Page.countDocuments({ status: 'Published' });
      const trashCount = await Page.countDocuments({ status: 'Trash' });
      const draftCount = await Page.countDocuments({ status: 'Draft' });
    // Fetch pages from the database
    const pages = await Page.find(({ status: { $in: ['Published', 'Draft'] } }));
    // Fetch sections for each page
    const pagesWithSections = await Promise.all(
      pages.map(async (page) => {
        const sections = await Section.find({ _id: { $in: page.sections } });
        return { ...page.toObject(), sections };
      })
    );
    // Render the pages.ejs file and pass the "pages" variable
    res.render("section/pages", { pages: pagesWithSections, user: req.user ,allCount, publishedCount, trashCount, draftCount});
  } catch (error) {
    console.error("Error fetching pages:", error);
    res.status(500).send("Internal Server Error");
  }
}));

// Home page
router.get("/create", wrapAsync(async (req, res) => {
  try {
    const slug = req.query.slug;
    // Fetch sections for the dropdown
    const sections = await Section.find();

    // Fetch pages for any additional data you might need
    const pages = await Page.find();

    res.render("section/create-pages.ejs", { slug ,page: {}, sections, pages, user: req.user });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
}));

// Create a new page with sections
router.post("/create", wrapAsync(async (req, res) => {
  console.log("Form Data:", req.body);
  try {
    let {
      page_name,
      page_router,
      sections,
      sub_heading,
      content,
      status,
      seoTitle,
      seoMetaDescription,
      searchEngines,
      'hs-radio-group': hsRadioGroup,
      metaRobots,
      breadcrumbsTitle,
      canonicalURL,
      show_search,
    } = req.body;
        // If page_router is empty, use page_name, convert it to lowercase and replace spaces with -
        if (!page_router) {
        page_router = page_name;
      }
    
      // Convert page_router to lowercase and replace spaces with -
      page_router = page_router.toLowerCase().replace(/\s+/g, '-');
    

    show_search = show_search.includes('true');
       // Check if a page with the same name already exists
       const existingPage = await Page.findOne({ page_name: page_name });
       if (existingPage) {
         return res.status(400).send("A page with this name already exists");
       }
    // Ensure that sections is an array before attempting to map over it
    let cleanedSections = Array.isArray(sections) ? sections : [sections];
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
      page_router,
      sub_heading,
      content,
      status,
      sections: sectionObjectIds,
      seoTitle,
      metaDescription: seoMetaDescription,
      searchEngines,
      hsRadioGroup,
      metaRobots,
      breadcrumbsTitle,
      canonicalURL,
      show_search,
    });

    // Save the page to get its ID
    const savedPage = await newPage.save();
    console.log("Saved Page:", savedPage);

    res.redirect(`/admin/pages/edit/${savedPage._id}`);
    } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}));

// Assuming you have an endpoint for updating the page status
router.put('/update-status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
      const page = await Page.findById(id);
      if (!page) {
          return res.status(404).json({ error: 'Page not found' });
      }

      page.status = status;
      await page.save();

      console.log({ message: 'Page status updated successfully' });
      res.json({ message: 'page status updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit page
router.get("/edit/:id", wrapAsync(async (req, res) => {
  try {
    console.log("edit page get route");
    const { id } = req.params;
    let path = ''; // Define the path variable
    if (req.headers.referer) {
      const url = new URL(req.headers.referer);
      path = url.pathname; // Assign a value to the path variable
      console.log("Referrer path:", path.slice(1, path.length - 1)); // Remove the leading and trailing slashes
    }
    console.log("Page ID:", id);
    if (!id || id === "undefined") { // Check for undefined or "undefined"
      return res.redirect(`/admin/pages/create?slug=${path.slice(1, path.length - 1)}`);
    }
    // Fetch the page from the database
    const page = await Page.findById(id).populate('sections');
    // If the page is not found, redirect to the create page route
    if (!page) {
      return res.redirect(`/admin/pages/create?slug=${path.slice(1, path.length - 1)}`);
    }
    page.sections.forEach(section => {
      console.log("Section title:", section.title);
    });
    // Fetch sections for the dropdown
    const sections = await Section.find();
    // Render the edit-page.ejs file and pass the page and sections
    res.render("section/edit-page.ejs", { page, sections ,user: req.user });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Internal Server Error");
  }
}));

// Update a page with sections
router.post("/edit/:id", wrapAsync(async (req, res) => {
  const { id } = req.params;
  try {
    let {
      page_name,
      page_router,
      sections,
      sub_heading,
      content,
      seoTitle,
      seoMetaDescription,
      searchEngines,
      'hs-radio-group': hsRadioGroup,
      metaRobots,
      breadcrumbsTitle,
      canonicalURL,
      show_search,
    } = req.body;

     // If page_router is empty, use page_name
    if (!page_router) {
      page_router = page_name;
    }
    // Convert page_router to lowercase and replace spaces with -
    page_router = page_router.toLowerCase().replace(/\s+/g, '-');

    show_search = show_search.includes('true');

     // Check if a page with the same name already exists
     const existingPage = await Page.findOne({ page_name: page_name, _id: { $ne: id } });
     if (existingPage) {
       return res.status(400).send("A page with this name already exists");
     }

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
    // Update the page
    const updatedPage = await Page.findByIdAndUpdate(id, {
      page_name,
      page_router,
      sub_heading,
      content,
      sections: sectionObjectIds,
      seoTitle,
      metaDescription: seoMetaDescription,
      searchEngines,
      hsRadioGroup,
      metaRobots,
      breadcrumbsTitle,
      canonicalURL,
      show_search,
    }, { new: true });

    console.log("Updated Page:", updatedPage);

    res.redirect("/admin/pages"); // Redirect to the pages route after updating the page
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}));

// Route to render published pages
router.get('/published', async (req, res) => {
  try {
      const pages = await Page.find({ status: 'Published' });
      const allCount = await Page.countDocuments();
        const publishedCount = await Page.countDocuments({ status: 'Published' });
        const trashCount = await Page.countDocuments({ status: 'Trash' });
        const draftCount = await Page.countDocuments({ status: 'Draft' });
      res.render('section/pages', { pages  ,user: req.user ,allCount, publishedCount, trashCount, draftCount});
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

// Route to render pages in trash
router.get('/trash', async (req, res) => {
  try {
      const pages = await Page.find({ status: 'Trash' });
      const allCount = await Page.countDocuments();
      const publishedCount = await Page.countDocuments({ status: 'Published' });
      const trashCount = await Page.countDocuments({ status: 'Trash' });
      const draftCount = await Page.countDocuments({ status: 'Draft' });
      res.render('section/pages', { pages  ,user: req.user ,allCount, publishedCount, trashCount, draftCount});
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

router.put('/restore/:id', async (req, res) => {
  try {
    console.log('Restore Page:', req.params.id);
    await Page.findByIdAndUpdate(req.params.id, { status: 'Published' });
    res.redirect('/admin/pages/trash');
  } catch (error) {
    console.error('Error restoring page:', error);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
      console.log('Delete Page:', req.params.id);
      await Page.findByIdAndDelete(req.params.id);
      res.redirect('/admin/pages/trash');
  } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).send('Internal Server Error');
  }
});

// Route to render draft pages
router.get('/draft', async (req, res) => {
  try {
      const pages = await Page.find({ status: 'Draft' });
      const allCount = await Page.countDocuments();
      const publishedCount = await Page.countDocuments({ status: 'Published' });
      const trashCount = await Page.countDocuments({ status: 'Trash' });
      const draftCount = await Page.countDocuments({ status: 'Draft' });
      res.render('section/pages', { pages  ,user: req.user, allCount, publishedCount, trashCount, draftCount});
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
});

module.exports = router;