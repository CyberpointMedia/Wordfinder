// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const passport = require('passport');
const wrapAsync = require('../middleware/wrapAsync');
const router = express.Router();
const alert =require('alert-node');


router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs');
});

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
    res.render('auth/login',{ messages: req.flash()});
});
// router.post('/login', passport.authenticate('local', {
//     successRedirect: '/admin/dashboard',
//     failureRedirect: '/auth/login',
//     failureFlash: 'Invalid username or password.'
// }));
router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { 
        return next(err); 
      }
      if (!user) { 
        req.flash('error', 'Wrong email or password');
        return res.redirect('/auth/login'); 
      }
      req.logIn(user, function(err) {
        if (err) { 
          return next(err); 
        }
        return res.redirect('/admin/dashboard');
      });
    })(req, res, next);
  });

// Logout route
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/'); // Redirect to the home page after logout
    });
});
module.exports = router;
