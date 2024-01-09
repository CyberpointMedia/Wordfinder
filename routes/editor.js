// routes/editor.js
const express = require('express');
const bcrypt = require('bcrypt');
const Editor = require('../models/editor');

const router = express.Router();

// Display the login page for editors
router.get('/login', (req, res) => {
    console.log("get editor login ");
    res.render('editor/login');
});

// Handle editor login

router.post('/login', async (req, res) => {
    console.log("post editor login ");
    const { email, password } = req.body;
    console.log("email:", email, "password:", password);
    
    try {
        console.log("Email to find:", email);
        const editor = await Editor.findOne({ email });
        console.log("Editor found:", editor);

        if (!editor) {
            console.log("Email not found");
            return res.render('editor/login', { error: 'Invalid email or password' });
        }

        const isPasswordMatch = await bcrypt.compare(password, editor.password);
        console.log("Entered Password:", password);
        console.log("Hashed Password from DB:", editor.password);

        if (isPasswordMatch) {
            console.log("Password match:", isPasswordMatch);
            return res.render('editor/login', { error: 'Invalid email or password' });
        }

        req.session.editor = {
            email: editor.email,
        };
        
        console.log("Redirecting to /post/all");
        console.log("Editor session data:", req.session.editor);
        res.redirect('/post/all');
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send('Internal Server Error');
    }
});


// Display the create editor page
router.get('/create', (req, res) => {
    res.render('editor/create');
});

// Handle creating a new editor
router.post('/create', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email is already registered
        const existingEditor = await Editor.findOne({ email });

        if (existingEditor) {
            return res.status(400).send('Editor with this email already exists');
        }
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new editor and save it to the database
        const newEditor = new Editor({ name, email, password: hashedPassword });
        await newEditor.save();

        // Fetch all editors from MongoDB
        const editors = await Editor.find();

        // Render the all editors view and pass the editors data
        res.render('editor/all-editor', { editors });
    } catch (error) {
        console.error('Error creating editor:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Display all editors
router.get('/all-editors', async (req, res) => {
    try {
        // Fetch all editors from MongoDB
        const editors = await Editor.find();

        // Render the all editors view and pass the editors data
        res.render('editor/all-editos', { editors });
    } catch (error) {
        console.error('Error fetching editors:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
