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

router.get('/words-that-start-with', wrapAsync(async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const pageSize = 20; // number of items per page
        const start = (page - 1) * pageSize;
        const end = page * pageSize;

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
        const totalPages = Math.ceil(combinations.length / pageSize);
        const pageItems = combinations.slice(start, end);
        const pages = Array.from({length: totalPages}, (_, i) => i + 1);

        res.render('frontend/category/words-that-start-with.ejs', { combinations: pageItems, page, pages, totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
}));

router.get('/words-that-end-in', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 20; // number of items per page
    const start = (page - 1) * pageSize;
    const end = page * pageSize;

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
    const pageItems = combinations.slice(start, end);

    const totalPages = Math.ceil(combinations.length / pageSize);

    res.render('frontend/category/words-that-end-in.ejs', { combinations: pageItems, page, totalPages });
});

router.get('/words-by-length', (req, res) => {
    const lengths = Array.from({length: 14}, (_, i) => i + 2); // generates an array [2, 3, ..., 15]
    res.render('frontend/category/words-by-length.ejs', { lengths });
});

router.get('/words-with-letters', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10; // number of items per page
    const start = (page - 1) * pageSize;
    const end = page * pageSize;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const pageItems = letters.slice(start, end);

    const totalPages = Math.ceil(letters.length / pageSize);

    res.render('frontend/category/words-with-letters.ejs', { letters: pageItems, page, totalPages });
});

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs');
});

module.exports = router;
