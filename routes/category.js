//route/catagory.js
const express = require('express');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');
const router = express.Router();
var wd = require("word-definition");
const axios = require('axios');
const wrapAsync = require('../middleware/wrapAsync');
const Post = require('../models/post');
const Page = require('../models/pages');
const Category = require('../models/categories');
const fetch = require('node-fetch');

// Middleware to parse incoming request bodies
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Serve static files 
router.use(express.static(path.join(__dirname, 'dist')));
router.use('/node_modules', express.static(__dirname + '/node_modules'));
router.use('/styles', express.static(path.join(__dirname, 'styles')));


router.get('/words-that-start-with', (req, res) => {
    function generateCombinations(letters, maxLength) {
        const combinations = [];

        function helper(prefix, chars) {
            for (let i = 0; i < chars.length; i++) {
                const newPrefix = prefix + chars[i];
                if (newPrefix.length <= maxLength) {
                    combinations.push(newPrefix);
                    helper(newPrefix, chars.slice(i + 1));
                }
            }
        }

        helper('', letters.split(''));

        return combinations;
    }

    const letters = 'abcdefghijklmnopqrstuvwxyz'; // replace with the actual letters
    const maxLength = 3; // replace with the actual maximum length
    const combinations = generateCombinations(letters, maxLength);

    res.render('frontend/category/words-that-start-with.ejs', { combinations });
});

router.get('/words-that-end-in', (req, res) => {
    function generateCombinations(letters, maxLength) {
        const combinations = [];

        function helper(prefix, chars) {
            for (let i = 0; i < chars.length; i++) {
                const newPrefix = prefix + chars[i];
                if (newPrefix.length <= maxLength) {
                    combinations.push(newPrefix);
                    helper(newPrefix, chars.slice(i + 1));
                }
            }
        }
        helper('', letters.split(''));
        return combinations;
    }

    const letters = 'abcdefghijklmnopqrstuvwxyz'; // replace with the actual letters
    const maxLength = 3; // replace with the actual maximum length
    const combinations = generateCombinations(letters, maxLength);

    res.render('frontend/category/words-that-end-in.ejs', { combinations });
});
router.get('/words-by-length', (req, res) => {
    const lengths = Array.from({length: 14}, (_, i) => i + 2); // generates an array [2, 3, ..., 15]
    res.render('frontend/category/words-by-length.ejs', { lengths });
});

router.get('/words-with-letters', (req, res) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    res.render('frontend/category/words-with-letters.ejs', { letters });
});

module.exports = router;
