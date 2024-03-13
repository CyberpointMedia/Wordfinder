// routes/appearance.js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Appearance = require('../models/appearance');
const mongoose = require('mongoose');
const Post = require('../models/post');
const Page = require('../models/pages');
const { ensureAdmin } = require('../middleware/authMiddleware');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));



// Render nav-menu view
router.get('/nav-menu', ensureAdmin, async (req, res) => {
    const posts = await Post.find({ status: 'Published' });
    const pages = await Page.find({ status: 'Published' });
    const menus = await Appearance.find({});
    const error = req.query.error;
    res.render('appearance/menu', { user: req.user, posts, pages, menus, error });
});
router.post('/save-menu', async (req, res) => {
    try {
        const { menuName, pages, posts, customLinks } = req.body;

        // Check if a menu with the same name already exists
        const existingMenu = await Appearance.findOne({ menuName });
        if (existingMenu) {
            console.log("Menu name already exists");
            res.redirect('/appearance/nav-menu?error=Menu%20name%20already%20exists');
        } else {

            console.log("Pages:", pages);
            const pageIds = Array.isArray(pages) ? pages.map(id => new mongoose.Types.ObjectId(id)) : [new mongoose.Types.ObjectId(pages)];
            console.log("Page IDs:", pageIds);
            const postIds = Array.isArray(posts) ? posts.map(id => new mongoose.Types.ObjectId(id)) : [new mongoose.Types.ObjectId(posts)];
            console.log("Post IDs:", postIds);
            const newMenu = new Appearance({ menuName, pages: pageIds, posts: postIds, customLinks });
            await newMenu.save();
            res.redirect('/appearance/nav-menu?error=Menu%20created%20successfully');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

router.get('/get-menu-details/:menuId', ensureAdmin, async (req, res) => {
            try {
                const menuId = req.params.menuId;
                console.log("Menu ID:", menuId);
                                    // Find the menu by id
        const menu = await Appearance.findById(menuId).populate('pages').populate('posts');
        if (menu) {
            res.json(menu);
        } else {
            res.status(404).json({ message: 'Menu not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

router.get('/edit-menu/:id', ensureAdmin, async (req, res) => {
    try {
        const menuId = req.params.id;

        // Find the menu by id
        const menu = await Appearance.findById(menuId).populate('pages').populate('posts');
        const menus = await Appearance.find();
        const pages = await Page.find({ status: 'Published' }); // or however you get your pages
        const posts = await Post.find({ status: 'Published' }); // or however you get your posts

        if (menu) {
            res.render('appearance/edit-menu', { user: req.user, menu,menus, pages , posts });
        } else {
            res.status(404).json({ message: 'Menu not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});
router.post('/edit-menu/:id', ensureAdmin, async (req, res) => {
    try {
        const menuId = req.params.id;
        const { menuName, pages, posts, customLinks } = req.body;

        // Convert pages and posts to ObjectId arrays
        const pageIds = Array.isArray(pages) ? pages.map(id => new mongoose.Types.ObjectId(id)) : [new mongoose.Types.ObjectId(pages)];
        const postIds = Array.isArray(posts) ? posts.map(id => new mongoose.Types.ObjectId(id)) : [new mongoose.Types.ObjectId(posts)];

        // Find the menu by id and update it
        const menu = await Appearance.findByIdAndUpdate(menuId, { menuName, pages: pageIds, posts: postIds, customLinks }, { new: true });

        if (menu) {
            res.redirect('/appearance/nav-menu');
        } else {
            res.status(404).json({ message: 'Menu not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Delete menu route
router.delete('/delete-menu/:id', ensureAdmin, async (req, res) => {
    try {
        const menuId = req.params.id;

        // Find the menu by id and delete it
        await Appearance.findByIdAndDelete(menuId);

        res.json({ message: 'Menu deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

module.exports = router;