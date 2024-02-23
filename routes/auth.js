// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const wrapAsync = require('../middleware/wrapAsync');
const router = express.Router();

// Admin credentials
const adminUsername = 'admin@gmail.com';
const adminPassword = 'adminpassword';

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs');
});

// Handle 404 - Page Not Found
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

router.post('/register', wrapAsync(async (req, res) => {
    console.log(" post register router auth.js");
    res.redirect('/login'); // Redirect to the login page after registration
}));
// Login route
router.get('/login', (req, res) => {
    console.log("auth.js login get ");
    // Render the admin login view
    res.render('auth/login', { isAdmin: res.locals.isAdmin });
});
router.post('/login', wrapAsync(async (req, res) => {
    const { email, password, userType } = req.body;

    if (userType === 'admin') {
        // Admin login
        if (email === 'admin@gmail.com' && password === 'adminpassword') {
            req.session.role = 'admin';
            res.redirect('/admin/dashboard');
        } else {
            // Admin login failed
            res.status(401).render('auth/login', { error: 'Invalid credentials' });
        }
    } else if (userType === 'user') {
        // User login
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).render('user/login', { error: 'Invalid credentials' });
            }
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(401).render('user/login', { error: 'Invalid credentials' });
            }
            // Set up the session for the user
            req.session.user = {
                email: user.email,
                // Add any other relevant user information you want to store in the session
            };
            req.session.userId = user._id;
            req.session.role = 'user';
            // Render the user dashboard view
            res.render('user/dashboard', { user });
            console.log('User login successful.');

    }
}));

module.exports = router;
