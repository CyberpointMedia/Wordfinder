// routes/admin.js
const express = require('express');
const User = require('../models/user');
const Editor = require('../models/editor');

const bcrypt = require('bcrypt');

const router = express.Router();

// Admin credentials (you may want to store these securely, not in the code)
const adminUsername = 'admin@gmail.com';
const adminPassword = 'adminpassword';

// Route to render the admin login page
router.get('/login', (req, res) => {
    console.log("admin.js login get ");
    // Render the admin login view
    res.render('admin/login', { isAdmin: res.locals.isAdmin });
});

// Route to handle the admin login form submission
router.post('/login', (req, res) => {
    try{
    console.log("admin .js login post ");
    const { email, password } = req.body;

    if (email === adminUsername && password === adminPassword) {
        // Admin login successful
        req.session.isAdmin = true;
        res.redirect('/admin/dashboard');
    } else {
        // Admin login failed
        res.status(401).render('admin/login', { isAdmin: res.locals.isAdmin });
    }
}
catch(err){
    console.log(err);
}
  });


// Route to handle admin registration
router.get('/register', (req, res) => {
    console.log("register get request call");
    res.render('admin/register');
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log("Register route called");

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send('User with this email already exists');
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user and save it to the database
        const newUser = new User({ name, email, password: hashedPassword, role: 'user' });
        await newUser.save();

        res.redirect('/admin/dashboard'); // Redirect to admin dashboard or wherever needed
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Admin dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Fetch all users from MongoDB
        const users = await User.find();

        // Render the admin dashboard view and pass the users data
        res.render('admin/dashboard', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

// View all users
router.get('/all-users', async (req, res) => {
    try {
        // Fetch all users from MongoDB
        const users = await User.find();

        // Render the all users view and pass the users data
        res.render('admin/all-users', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
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
router.get('/all-editors', async (req, res) => {
    try {
        // Fetch all editors from MongoDB
        const editors = await Editor.find();

        // Render the all editors view and pass the editors data
        res.render('editor/all-editor', { editors });
    } catch (error) {
        console.error('Error fetching editors:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Render the create editor form
router.get('/create-editor', (req, res) => {
    res.render('editor/create');
});
// Handle the creation of a new editor
router.post('/create-editor', async (req, res) => {
    const { name, email, password } = req.body;

    try {
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
    } catch (error) {
        console.error('Error creating editor:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Route to handle the deletion of an editor
router.get('/delete-editor/:editorId', async (req, res) => {
    const editorId = req.params.editorId;

    try {
        // Find and delete the editor from the database
        const deletedEditor = await Editor.findByIdAndDelete(editorId);

        if (!deletedEditor) {
            // Editor not found
            return res.status(404).send('Editor not found');
        }

        // Redirect back to the all editors page
        res.redirect('/admin/all-editors');
    } catch (error) {
        console.error('Error deleting editor:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Handle user deletion
router.post('/admin/delete/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find the user by ID and delete it
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            // If the user was not found
            return res.status(404).send('User not found');
        }

        // Redirect or respond as needed after successful deletion
        res.redirect('/admin/all-users'); // Redirect to the page showing all users
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error');
    }
});
// Update user post limit
router.post('/update-post-limit/:userId', async (req, res) => {
    const { postLimit } = req.body;
    const userId = req.params.userId;

    try {
        // Find the user by ID and update the post limit
        await User.findByIdAndUpdate(userId, { postLimit });

        // Redirect back to the admin users page or any other desired page
        res.redirect('/admin/all-users');
    } catch (error) {
        console.error('Error updating post limit:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

module.exports = router;
