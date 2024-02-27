//src/app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');
const passport = require('passport');

// Load environment variables from .env
require('dotenv').config();
console.log('PORT:', process.env.PORT);
console.log('MONGO_URL:', process.env.MONGO_URL);

// Import passport-config.js to configure Passport
const passportConfig = require('../public/js/passport-config');  // Adjusted path
const Section = require('../models/section');  // Adjusted path
const User = require('../models/user.js');  // Adjusted path

const bodyParser = require('body-parser');
const { parse } = require('node-html-parser');
const session = require('express-session');

const userRoutes = require('../routes/user');  
const authRoutes = require('../routes/auth');  
const postRoutes = require('../routes/post');  
const sectionRoutes = require('../routes/section');  
const adminRoutes = require('../routes/admin');  
const editorRoutes = require('../routes/editor'); 
const pagesRoutes = require('../routes/pages');  
const frontendRoutes = require('../routes/frontend'); 
const libraryRoutes = require('../routes/library'); 

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
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// Use method-override middleware
app.use(methodOverride('_method'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs');
});
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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use('/', frontendRoutes);
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
// Library
app.use('/library', libraryRoutes);

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
