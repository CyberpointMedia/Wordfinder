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
router.get('/register', ensureAdmin ,(req, res) => {
    if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'administrator')) {
        res.render('admin/create-profile.ejs', { user: req.user });
    } else {
        res.status(403).send('Forbidden');
    }
});

// Route to handle user profile creation
router.post('/create-profile', ensureAdmin , async (req, res) => {
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

        res.render('admin/all-users', {users, totalCount,user: req.user});
    } catch (err) {
        res.render('admin/create-profile.ejs', { errorMessage: `Error creating User profile: ${err.message}` });
    }
});

// Route to show the edit profile form
router.get('/edit-profile/:id', ensureAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('admin/edit-profile.ejs', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});

// Route to handle profile updates
router.post('/edit-profile/:id', ensureAdmin, async (req, res) => {
    try {
        const updates = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            website: req.body.website,
            role: req.body.role,
            sendNotification: req.body.sendNotification === 'on'
        };

        // Don't update the password if it wasn't provided
        if (req.body.password) {
            updates.password = await bcrypt.hash(req.body.password, 10);
        }

        await User.findByIdAndUpdate(req.params.id, updates);
        res.redirect('/admin/all-users');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});
// Route to handle profile deletion
router.get('/delete-profile/:id', ensureAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/all-users');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred');
    }
});
// Admin dashboard

router.get('/dashboard', wrapAsync(async (req, res) => {
    // Fetch users
    const users = await User.find();
    // Fetch total number of posts
    const totalPosts = await Post.countDocuments();
    const totalPages = await Page.countDocuments();
    // Fetch posts based on user role
    let posts;
    if (req.user.role === 'admin' || req.user.role === 'administrator' || req.user.role === 'author') {
        posts = await Post.find().populate('author').sort({date: -1}).limit(5);
    } else if (req.user.role === 'editor') {
        posts = await Post.find({ author: req.user._id }).populate('author').sort({date: -1}).limit(5);
    }

    // Render dashboard
    res.render('admin/dashboard', { users, totalPosts ,totalPages, posts, user: req.user });
}));

// View all users
router.get('/all-users', ensureAdmin, async (req, res) => {
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
        administrator: administratorCount || 0,
        total: (subscriberCount || 0) + (authorCount || 0) + (editorCount || 0) + (administratorCount || 0)

    };

    res.render('admin/all-users', {users: users || [], totalCount ,user: req.user});
});
// Route for subscribers
router.get('/all-users/subscriber', ensureAdmin, async (req, res) => {
    let subscriberCount, authorCount, editorCount, administratorCount;
    try {
        const users = await User.find({ role: 'subscriber' });
        subscriberCount = await User.countDocuments({ role: 'subscriber' });
        authorCount = await User.countDocuments({ role: 'author' });
        editorCount = await User.countDocuments({ role: 'editor' });
        administratorCount = await User.countDocuments({ role: 'administrator' });
        const totalCount = {
            subscriber: subscriberCount || 0,
            author: authorCount || 0,
            editor: editorCount || 0,
            administrator: administratorCount || 0,
            total: (subscriberCount || 0) + (authorCount || 0) + (editorCount || 0) + (administratorCount || 0)
        };
        res.render('admin/all-users', { users, totalCount, user: req.user });
    } catch (err) {
        console.error(err);
    }
});

// Route for editors
router.get('/all-users/editor', ensureAdmin, async (req, res) => {
    let subscriberCount, authorCount, editorCount, administratorCount;
    try {
        const users = await User.find({ role: 'editor' });
        subscriberCount = await User.countDocuments({ role: 'subscriber' });
        authorCount = await User.countDocuments({ role: 'author' });
        editorCount = await User.countDocuments({ role: 'editor' });
        administratorCount = await User.countDocuments({ role: 'administrator' });
        const totalCount = {
            subscriber: subscriberCount || 0,
            author: authorCount || 0,
            editor: editorCount || 0,
            administrator: administratorCount || 0,
            total: (subscriberCount || 0) + (authorCount || 0) + (editorCount || 0) + (administratorCount || 0)
        };
        res.render('admin/all-users', { users, totalCount, user: req.user });
    } catch (err) {
        console.error(err);
    }
});

// Route for administrators
router.get('/all-users/administrator', ensureAdmin, async (req, res) => {
    let subscriberCount, authorCount, editorCount, administratorCount;
    try {
        const users = await User.find({ role: 'administrator' });
        subscriberCount = await User.countDocuments({ role: 'subscriber' });
        authorCount = await User.countDocuments({ role: 'author' });
        editorCount = await User.countDocuments({ role: 'editor' });
        administratorCount = await User.countDocuments({ role: 'administrator' });
        const totalCount = {
            subscriber: subscriberCount || 0,
            author: authorCount || 0,
            editor: editorCount || 0,
            administrator: administratorCount || 0,
            total: (subscriberCount || 0) + (authorCount || 0) + (editorCount || 0) + (administratorCount || 0)
        };
        res.render('admin/all-users', { users, totalCount, user: req.user });
    } catch (err) {
        console.error(err);
    }
});
// Route for authors
router.get('/all-users/author', ensureAdmin, async (req, res) => {
    let authorCount, subscriberCount, editorCount, administratorCount;
    try {
        const users = await User.find({ role: 'author' });
        subscriberCount = await User.countDocuments({ role: 'subscriber' });
        authorCount = await User.countDocuments({ role: 'author' });
        editorCount = await User.countDocuments({ role: 'editor' });
        administratorCount = await User.countDocuments({ role: 'administrator' });
        const totalCount = {
            subscriber: subscriberCount || 0,
            author: authorCount || 0,
            editor: editorCount || 0,
            administrator: administratorCount || 0,
            total: (subscriberCount || 0) + (authorCount || 0) + (editorCount || 0) + (administratorCount || 0)
        };
        res.render('admin/all-users', { users, totalCount, user: req.user });
    } catch (err) {
        console.error(err);
    }
});

// Route for editors
router.get('/all-users/editor', ensureAdmin, async (req, res) => {
    const users = await User.find({ role: 'editor' });
    res.render('admin/all-users', { users, totalCount ,user: req.user });
});

// Route for administrators
router.get('/all-users/administrator', ensureAdmin, async (req, res) => {
    const users = await User.find({ role: 'administrator' });
    res.render('admin/all-users', { users, totalCount ,user: req.user });
});

// Logout route
router.get('/logout', (req, res) => {
    // Destroy the session to log the admin out
    req.logout();
    res.redirect('/admin/login');
});

module.exports = router;