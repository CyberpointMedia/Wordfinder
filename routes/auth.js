// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router();

// Admin credentials
const adminUsername = 'admin@gmail.com';
const adminPassword = 'adminpassword';
// Middleware to check if the user is logged in
// const checkLoggedIn = (req, res, next) => {
//     if (req.session.user || req.session.isAdmin) {
//         // If the user or admin is logged in, proceed to the next middleware or route
//         next();
//     } else {
//         // If not logged in, redirect to the login page
//         res.redirect('/login');
//     }
// };

// Route to render the registration form
router.get('/register', (req, res) => {
    console.log("get auth.js register call");
    // Redirect admins to the admin registration route
    if (req.session.isAdmin) {
        return res.redirect('/admin/register');
    }
    res.render('register');
});

router.post('/register', async (req, res) => {
    console.log(" post register router auth.js");
    res.redirect('/login'); // Redirect to the login page after registration
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password, userType } = req.body;

    if (userType === 'admin') {
        // Admin login
        if (email === adminUsername && password === adminPassword) {
            req.session.isAdmin = true;
            res.redirect('/admin/dashboard');
        } else {
            res.status(401).render('admin/admin-login', { isAdmin: req.session.isAdmin });
        }
    } else if (userType === 'user') {
        // User login
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).render('user/login', { error: 'Invalid credentials' });
            }

            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (isPasswordMatch) {
                return res.status(401).render('user/login', { error: 'Invalid credentials' });
            }

            // Set up the session for the user
            req.session.user = {
                email: user.email,
                // Add any other relevant user information you want to store in the session
            };
            req.session.userId = user._id;
            req.session.isAdmin = false;

            // Render the user dashboard view
            res.render('user/dashboard', { user });
            console.log('User login successful.');
        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).send('Internal Server Error');
        }
    }
});




module.exports = router;
