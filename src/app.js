const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');
const passport = require('passport');

// Load environment variables from .env
require('dotenv').config();

// Import passport-config.js to configure Passport
const passportConfig = require('../public/js/passport-config');  // Adjusted path

const Section = require('../models/section');  // Adjusted path
const User = require('../models/user.js');  // Adjusted path

const bodyParser = require('body-parser');
const { parse } = require('node-html-parser');
const session = require('express-session');

const userRoutes = require('../routes/user');  // Adjusted path
const authRoutes = require('../routes/auth');  // Adjusted path
const postRoutes = require('../routes/post');  // Adjusted path
const sectionRoutes = require('../routes/section');  // Adjusted path
const adminRoutes = require('../routes/admin');  // Adjusted path
const editorRoutes = require('../routes/editor');  // Adjusted path
const pagesRoutes = require('../routes/pages');  // Adjusted path

const app = express();
const port = process.env.PORT;

// Set up session and Passport middleware
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: '*',
}))

app.locals.parser = parse;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up EJS as the view engine
app.set('views', path.join(__dirname, '../views'));  // Adjusted path
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));  // Adjusted path
app.use('/admin/node_modules', express.static(path.join(__dirname, '../node_modules')));  // Adjusted path
// Use method-override middleware
app.use(methodOverride('_method'));

// MongoDB connection
const mongoUrl = process.env.MONGO_URL;
main()
    .then(() => {
        console.log('connected to db');
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongoUrl);
}

// Use the user and auth routes
app.use('/user', userRoutes);
// Use the authentication routes
app.use('/auth', authRoutes);
// Post route
app.use('/post', postRoutes);
// Use the section routes
app.use('/admin/section', sectionRoutes);
// Use the admin routes
app.use('/admin', adminRoutes);
// Use the editor routes
app.use('/editor', editorRoutes);
// Pages
app.use('/admin/pages', pagesRoutes);

// Dashboard route
app.get('/user/dashboard', (req, res) => {
    const user = req.user; // Passport sets the authenticated user in req.user

    if (user) {
        // User is authenticated
        res.render('user/dashboard', { user });
    } else {
        // User not found in the session
        res.send('User not found');
    }
});

// User routes
app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('user/login');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
