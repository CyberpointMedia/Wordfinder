//src/app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const session = require('express-session');
const flash = require('connect-flash');
const Editor = require('../models/editor'); 

// Load environment variables from .env
require('dotenv').config();

const User = require('../models/user.js'); 

const userRoutes = require('../routes/user-profile.js');  
const authRoutes = require('../routes/auth');  
const postRoutes = require('../routes/post');  
const sectionRoutes = require('../routes/section');  
const adminRoutes = require('../routes/admin');  
const editorRoutes = require('../routes/editor'); 
const pagesRoutes = require('../routes/pages');  
const frontendRoutes = require('../routes/frontend'); 
const libraryRoutes = require('../routes/library'); 
const { ensureAdmin, ensureEditor, ensureAuthor } = require('../middleware/authMiddleware');
const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: '*',
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up EJS as the view engine
app.set('views', path.join(__dirname, '../views'));  // Adjusted path
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));  // Adjusted path
app.use('/admin/node_modules', express.static(path.join(__dirname, '../node_modules')));  // Adjusted path

app.use(methodOverride('_method'));

app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    // Check for superadmin credentials
    if (email === 'admin@gmail.com' && password === 'adminpassword') {
        return done(null, { id: 'superadmin', email: 'admin@gmail.com', role: 'admin' });
    }

    // Check for regular users
    const user = await User.findOne({ email });
    if (user) {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Invalid credentials.\n' });
        }
        return done(null, user);
    }

    // Check for editor credentials
    const editor = await Editor.findOne({ email });
    if (editor) {
        console.log("editor", editor);
        const isValidPassword = await bcrypt.compare(password, editor.password);
        if (!isValidPassword) {
            return done(null, false, { message: 'Invalid credentials.\n' });
        }
        return done(null, editor);
    }

    return done(null, false, { message: 'Invalid credentials.\n' });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    if (id === 'superadmin') {
        return done(null, { id: 'superadmin', email: 'admin@gmail.com', role: 'admin' });
    }
    try {
        const user = await User.findById(id);
        if (user) {
            done(null, user);
        } else {
            const editor = await Editor.findById(id);
            if (editor) {
                done(null, editor);
            } else {
                done(new Error('No user with this id.'));
            }
        }
    } catch (err) {
        done(err);
    }
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
app.use('/user', ensureAdmin,ensureAuthor,ensureEditor, userRoutes);
app.use('/auth', authRoutes);
app.use('/post', ensureAdmin, ensureAuthor, ensureEditor, postRoutes);
app.use('/admin/section', ensureAdmin, ensureEditor, sectionRoutes);
app.use('/admin',ensureAdmin ,ensureEditor ,ensureAuthor , adminRoutes);
app.use('/editor', ensureEditor, editorRoutes);
app.use('/admin/pages', ensureAdmin, ensureEditor, pagesRoutes);
app.use('/library', ensureAdmin, ensureAuthor, ensureEditor, libraryRoutes);

