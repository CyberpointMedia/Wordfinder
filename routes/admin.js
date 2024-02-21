// routes/admin.js
const express = require('express');
const { isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/user');
const Editor = require('../models/editor');
const bcrypt = require('bcrypt');
const wrapAsync = require('../middleware/wrapAsync');
const router = express.Router();

// Route to handle admin registration
router.get('/register', isAdmin,(req, res) => {
    console.log("register get request call");
    res.render('admin/create-profile.ejs');
});

// Route to handle user profile creation
router.post('/create-profile', isAdmin, async (req, res) => {
    console.log("register post request call", req.body);
    try {
        if (!req.body.username) {
            throw new Error('Username is required');
        }

        // Check if the user's email is already registered
        const existingUser = await User.findOne({ email: req.body.email });

        if (existingUser) {
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
        res.render('admin/all-users');
    } catch (err) {
        res.render('admin/create-profile', { errorMessage: `Error creating User profile: ${err.message}` });
    }
});

// Admin dashboard
router.get('/dashboard', isAdmin, wrapAsync(async (req, res) => {
    // Fetch users
    const users = await User.find();
    // Render dashboard
    res.render('admin/dashboard', { users });
  }));

// View all users
router.get('/all-users', async (req, res) => {
    try {
        const users = await User.find();
        const subscriberCount = await User.countDocuments({ role: 'subscriber' });
        const contributorCount = await User.countDocuments({ role: 'contributor' });
        const authorCount = await User.countDocuments({ role: 'author' });
        const editorCount = await User.countDocuments({ role: 'editor' });
        const administratorCount = await User.countDocuments({ role: 'administrator' });

        const totalCount = {
            subscriber: subscriberCount,
            contributor: contributorCount,
            author: authorCount,
            editor: editorCount,
            administrator: administratorCount
        };

        res.render('admin/all-users', {users, totalCount });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    // Destroy the session to log the admin out
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Internal Server Error');
        } else {
            // Redirect to the login page after successful logout
            res.redirect('/admin/login');
        }
    });
});

// Display all editors
router.get('/all-editors', wrapAsync(async (req, res) => {
        // Fetch all editors from MongoDB
        const editors = await Editor.find();

        // Render the all editors view and pass the editors data
        res.render('editor/all-editor', { editors });
}));

// Render the create editor form
router.get('/create-editor', (req, res) => {
    res.render('editor/create');
});
// Handle the creation of a new editor
router.post('/create-editor', wrapAsync(async (req, res) => {
    const { name, email, password } = req.body;
        // Check if the editor's email is already registered
        const existingEditor = await Editor.findOne({ email });

        if (existingEditor) {
            return res.status(400).send('Editor with this email already exists');
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new editor and save it to the database
        const newEditor = new Editor({ name, email, password: hashedPassword });
        await newEditor.save();

        res.redirect('/admin/all-editors'); // Redirect to the all editors page
}));
// Route to handle the deletion of an editor
router.get('/delete-editor/:editorId', wrapAsync(async (req, res) => {
    const editorId = req.params.editorId;

        // Find and delete the editor from the database
        const deletedEditor = await Editor.findByIdAndDelete(editorId);

        if (!deletedEditor) {
            // Editor not found
            return res.status(404).send('Editor not found');
        }
        // Redirect back to the all editors page
        res.redirect('/admin/all-editors');
}));

// Handle user deletion
router.post('/admin/delete/:userId', wrapAsync(async (req, res) => {
    const userId = req.params.userId;
        // Find the user by ID and delete it
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            // If the user was not found
            return res.status(404).send('User not found');
        }

        // Redirect or respond as needed after successful deletion
        res.redirect('/admin/all-users'); // Redirect to the page showing all users

}));
// Update user post limit
router.post('/update-post-limit/:userId', wrapAsync(async (req, res) => {
    const { postLimit } = req.body;
    const userId = req.params.userId;

        // Find the user by ID and update the post limit
        await User.findByIdAndUpdate(userId, { postLimit });

        // Redirect back to the admin users page or any other desired page
        res.redirect('/admin/all-users');

}));


// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = router;
