// routes/appearance.js
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Appearance = require('../models/appearance');
const ShowMenu = require('../models/show-menu');
const mongoose = require('mongoose');
const Post = require('../models/post');
const Page = require('../models/pages');
const { ensureAdmin } = require('../middleware/authMiddleware.js');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Render nav-menu view
router.get('/nav-menu', ensureAdmin, async (req, res) => {
    const posts = await Post.find({ status: 'Published' });
    const pages = await Page.find({ status: 'Published' });
    const menus = await Appearance.find({});
    const error = req.query.error;

    // Get the selected menu ID from the query parameters or initialize it to a default value
    const selectedMenuId = req.query.selectedMenuId || '';

    // Fetch the selected menu details
    let selectedMenu = null;
    if (selectedMenuId) {
        selectedMenu = await Appearance.findById(selectedMenuId).populate('pages').populate('posts');
    }
    res.render('appearance/menu', { user: req.user, posts, pages, menus, error, selectedMenuId, selectedMenu });
});

router.post('/save-menu', async (req, res) => {
    try {
        const { menuName, pages, posts, customLinks, headerMenu } = req.body;

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
            const newMenu = new Appearance({ menuName, pages: pageIds, posts: postIds, customLinks, headerMenu });
            await newMenu.save();
            res.redirect(`/appearance/edit-menu/${newMenu._id}?message=New Menu created successfully`);
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
            res.render('appearance/edit-menu', { user: req.user, menu, menus, pages, posts  ,selectedMenuId: menuId});
        } else {
            res.status(404).json({ message: 'Menu not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// routes/appearance.js
router.post('/show-menu', ensureAdmin, async (req, res) => {
    try {
        // Extract data from the request
        const { selectedMenuId, updated_name, parent ,headerMenu } = req.body;
        console.log("Selected Menu ID:", selectedMenuId , "Updated Name:", updated_name, "Parent:", parent);

        // Find the appearance by its id
        let appearance = await Appearance.findOne({ _id: selectedMenuId }).populate('pages posts');
        console.log("Appearance:", appearance);
        if (!appearance) {
            return res.status(404).json({ error: 'Appearance not found' });
        }
        // Check if updated_name and parent are arrays and have the same length
        if (!Array.isArray(updated_name) || !Array.isArray(parent) || updated_name.length !== parent.length) {
            return res.status(400).json({ error: 'Invalid updated_name or parent' });
        }

        // Find the ShowMenu document if it exists, otherwise create a new one
        let showMenu = await ShowMenu.findOne({ menuName: appearance.menuName });

        if (!showMenu) {
            // If the ShowMenu document does not exist, create a new one with the fetched pages, posts, and customLinks
            showMenu = new ShowMenu({ 
                menuName: appearance.menuName,
                items: appearance.pages.map((page, index) => ({
                    type: 'page', 
                    id: page._id, 
                    updated_name: updated_name[index], 
                    parent: parent[index]
                })).concat(
                    appearance.posts.map((post, index) => ({
                        type: 'post', 
                        id: post._id, 
                        updated_name: updated_name[index], 
                        parent: parent[index]
                    })),
                    appearance.customLinks.map((customLink, index) => ({
                        type: 'customLink', 
                        id: customLink._id, 
                        updated_name: updated_name[index], 
                        parent: parent[index]
                    }))
                ),
                 headerMenu: headerMenu === 'on'
            });
        } else {
            // If the ShowMenu document exists, update the updated_name and parent fields of each item
            showMenu.items.forEach((item, index) => {
                if (updated_name[index] !== '') {
                    item.updated_name = updated_name[index];
                }
                if (parent[index] !== '') {
                    item.parent = parent[index];
                }
            });
            showMenu.headerMenu = headerMenu === 'on'; // Update the headerMenu field
        }

        await showMenu.save();

        res.redirect('/appearance/nav-menu');
    } catch (error) {
        console.log(error);
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
            res.redirect(`/appearance/edit-menu/${menu._id}?message=Menu updated successfully`);
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