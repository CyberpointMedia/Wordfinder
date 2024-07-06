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
        const pageSize = 20; // Number of items per page
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

        const letters = 'abcdefghijklmnopqrstuvwxyz';
        const maxLength = 3;
        const combinations = generateCombinations(letters, maxLength);
        const totalPages = Math.ceil(combinations.length / pageSize);
        const pageItems = combinations.slice(start, end);
        const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

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
    const pageSize = 30; // Number of items (letters or combinations) per page
    const start = (page - 1) * pageSize;
    const end = page * pageSize;

    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const combinations = [];

    // Generate combinations A-Z
    for (let i = 0; i < 26; i++) {
        const contains_char1 = String.fromCharCode(65 + i); // 'A' is 65 in ASCII
        for (let j = i + 1; j < 26; j++) {
            const contains_char2 = String.fromCharCode(65 + j); // 'B' is 66 in ASCII, etc.
            combinations.push({ char1: contains_char1, char2: contains_char2 });
            combinations.push({ char1: contains_char1, char2: contains_char2, without: true }); // Add without option
        }
    }

    // Merge letters and combinations
    const allItems = [...letters, ...combinations];

    // Calculate items for the current page
    const pageItems = allItems.slice(start, end);

    const totalPages = Math.ceil(allItems.length / pageSize);

    res.render('frontend/category/words-with-letters.ejs', {
        letters: pageItems,
        page,
        totalPages
    });
});



// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs');
});


// router.get('/words-that-start-with', wrapAsync(async (req, res) => {
//     try {
//         const page = Number(req.query.page) || 1;
//         const pageSize = 20; // number of items per page
//         const start = (page - 1) * pageSize;
//         const end = page * pageSize;

//         function generateCombinations(letters, maxLength) {
//             const combinations = [];

//             function helper(prefix, chars) {
//                 for (let i = 0; i < chars.length; i++) {
//                     const newPrefix = prefix + chars[i];
//                     if (newPrefix.length <= maxLength) {
//                         combinations.push(newPrefix);
//                         helper(newPrefix, chars.slice(i + 1));
//                     }
//                 }
//             }

//             helper('', letters.split(''));

//             return combinations;
//         }

//         const letters = 'abcdefghijklmnopqrstuvwxyz'; // replace with the actual letters
//         const maxLength = 3; // replace with the actual maximum length
//         const allCombinations = generateCombinations(letters, maxLength);

//         const dictionary = 'wwf'; // default dictionary

//         // Filter combinations to only include those which result in valid words
//         const filterCombinations = async (combinations) => {
//             const filteredCombinationsPromises = combinations.map(async (combination) => {
//                 let url = `https://fly.wordfinderapi.com/api/search?letters=&word_sorting=points&group_by_length=true&page_size=20000&dictionary=${dictionary}&starts_with=${combination}`;
//                 const response = await fetch(url);
//                 const data = await response.json();
//                 if (data && data.word_pages && data.word_pages.length > 0) {
//                     return combination;
//                 }
//                 return null;
//             });
//             let filteredCombinationsResults = await Promise.all(filteredCombinationsPromises);
//             return filteredCombinationsResults.filter(combination => combination !== null);
//         };

//         let filteredCombinations = await filterCombinations(allCombinations);

//         // If fewer than 5 valid combinations, expand the range and refetch
//         let expandFactor = 1;
//         while (filteredCombinations.length < 5 && allCombinations.length > filteredCombinations.length) {
//             expandFactor++;
//             const expandedCombinations = allCombinations.slice(0, Math.min(allCombinations.length, end * expandFactor));
//             filteredCombinations = await filterCombinations(expandedCombinations);
//         }

//         // Group combinations by their starting letter
//         const groupedCombinations = filteredCombinations.reduce((acc, combination) => {
//             const firstLetter = combination.charAt(0).toUpperCase();
//             if (!acc[firstLetter]) {
//                 acc[firstLetter] = [];
//             }
//             acc[firstLetter].push(combination.toUpperCase());
//             return acc;
//         }, {});

//         const totalPages = Math.ceil(filteredCombinations.length / pageSize);
//         const pageItems = Object.entries(groupedCombinations).slice(start, end);
//         const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

//         res.render('frontend/category/words-that-start-with.ejs', { groupedCombinations: pageItems, page, pages, totalPages });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('An error occurred while processing your request.');
//     }
// }));


module.exports = router;
