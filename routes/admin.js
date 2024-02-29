// routes/admin.js
const express = require('express');
const { isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/user');
const Editor = require('../models/editor');
const bcrypt = require('bcrypt');
const wrapAsync = require('../middleware/wrapAsync');
const router = express.Router();
const Post = require('../models/post'); 
const Page = require('../models/pages');
const { ensureAdmin, ensureEditor, ensureAuthor } = require('../middleware/authMiddleware');

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs');
});

// Route to handle admin registration
router.get('/register', (req, res) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        res.render('admin/create-profile.ejs');
    } else {
        res.status(403).send('Forbidden');
    }
});

// Route to handle user profile creation
router.post('/create-profile', async (req, res) => {
    console.log("register post request call", req.body);
    try {
        if (!req.body.username) {
            throw new Error('Username is required');
        }

        // Check if the user's email is already registered
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
            alert('User with this email already exists');
            throw new Error('User with this email already exists');
        }
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            website: req.body.website,
            role: req.body.role,
            sendNotification: req.body.sendNotification === 'on'
        });
        await user.save();

        // Fetch the counts after saving the user
        const subscriberCount = await User.countDocuments({ role: 'subscriber' });
        const authorCount = await User.countDocuments({ role: 'author' });
        const editorCount = await User.countDocuments({ role: 'editor' });
        const administratorCount = await User.countDocuments({ role: 'administrator' });

        const totalCount = {
            subscriber: subscriberCount || 0,
            author: authorCount || 0,
            editor: editorCount || 0,
            administrator: administratorCount || 0
        };

        const users = await User.find();

        res.render('admin/all-users', {users, totalCount});
    } catch (err) {
        res.render('admin/create-profile.ejs', { errorMessage: `Error creating User profile: ${err.message}` });
    }
});

// Admin dashboard
router.get('/dashboard', wrapAsync(async (req, res) => {
    // Fetch users
    const users = await User.find();
    // Fetch total number of posts
    const totalPosts = await Post.countDocuments();
    const totalPages = await Page.countDocuments();

    // Render dashboard
    res.render('admin/dashboard', { users, totalPosts ,totalPages});
}));

// View all users
router.get('/all-users', async (req, res) => {
    let users, subscriberCount, authorCount, editorCount, administratorCount;

    try {
        users = await User.find();
        subscriberCount = await User.countDocuments({ role: 'subscriber' });
        authorCount = await User.countDocuments({ role: 'author' });
        editorCount = await User.countDocuments({ role: 'editor' });
        administratorCount = await User.countDocuments({ role: 'administrator' });
    } catch (err) {
        console.error(err);
    }

    const totalCount = {
        subscriber: subscriberCount || 0,
        author: authorCount || 0,
        editor: editorCount || 0,
        administrator: administratorCount || 0
    };

    res.render('admin/all-users', {users: users || [], totalCount });
});

// Logout route
router.get('/logout', (req, res) => {
    // Destroy the session to log the admin out
    req.logout();
    res.redirect('/admin/login');
});

module.exports = router;