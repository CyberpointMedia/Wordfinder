//route/frontend.js
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
const Section = require('../models/section');
const Category = require('../models/categories');
const fetch = require('node-fetch');
const visitCounter = require('../middleware/visitCounter');

// Middleware to parse incoming request bodies
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Serve static files 
router.use(express.static(path.join(__dirname, 'dist')));
router.use('/node_modules', express.static(__dirname + '/node_modules'));
router.use('/styles', express.static(path.join(__dirname, 'styles')));

// Define routes
router.get('/', visitCounter, async (req, res) => {
    try {
        console.log("hello sir ");
        const morePosts = await Post.find({ status: 'Published' }).limit(3);
        res.render('frontend/index.ejs', { morePosts });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/no-words-found', async (req, res) => {
    try {
        console.log("no words found");
        const morePosts = await Post.find({ status: 'Published' }).limit(3);
        res.render('frontend/no-words-found.ejs', { morePosts });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/unscramble', visitCounter, async (req, res) => {
    try {
        const letters = req.body.letters;
        const morePosts = await Post.find({ status: 'Published' }).limit(3);
        const startsWith = req.body.starts_with || '';
        const endsWith = req.body.end_with || '';
        const contains = req.body.contains || '';
        const length = req.body.length || 0;
        const include = req.body.include || '';
        const exclude = req.body.exclude || '';
        const dictionary = req.body.scrabble_type || 'wwf';
        let url = `https://fly.wordfinderapi.com/api/search?letters=${letters.toLowerCase()}&word_sorting=points&group_by_length=true&page_size=20000&dictionary=${dictionary}`;

        // Construct the URL with query parameters
        // Append optional parameters if provided
        if (startsWith.trim() !== '') {
            url += `&starts_with=${startsWith}`;
        }
        if (endsWith.trim() !== '') {
            url += `&ends_with=${endsWith}`;
        }
        if (contains.trim() !== '') {
            url += `&contains=${contains}`;
        }
        if (include.trim() !== '') {
            url += `&include_letters=${include}`;
        }
        if (exclude.trim() !== '') {
            url += `&exclude_letters=${exclude}`;
        }
        if (length > 0) {
            url += `&length=${length}`;
        }
        const response = await fetch(url);
        const data = await response.json();

        if (data && Array.isArray(data.word_pages)) {
            // Transform the API response into the expected data structure
            const wordsByLength = data.word_pages.reduce((acc, wordPage) => {
                wordPage.word_list.forEach(wordObj => {
                    const length = wordObj.word.length;
                    if (!acc[length]) {
                        acc[length] = [];
                    }
                    acc[length].push(wordObj);
                });
                return acc;
            }, {});
            let redirectUrl = `/unscramble/${letters}/dictionary/${dictionary}`;
            req.session.wordfinder = { letters, morePosts, startsWith, endsWith, contains, includeLetters: include, excludeLetters: exclude, specifiedLength: length, wordsByLength };
            res.redirect(redirectUrl);
         } else {
            console.error('Error: Invalid data structure');
            res.redirect('/no-words-found');
        }
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/no-words-found');
    }
});

router.get('/unscramble/:letters/dictionary/:dictionary', wrapAsync(async (req, res) => {
    const { letters, morePosts, startsWith, endsWith, contains, includeLetters, excludeLetters, specifiedLength, wordsByLength } = req.session.wordfinder;
    res.render('frontend/words-with-X-and-Q.ejs', { letters, morePosts, startsWith, endsWith, contains, includeLetters, excludeLetters, specifiedLength, wordsByLength });
}));

router.get('/words-that-start-with/:combination', async (req, res) => {
    try {
        const combination = req.params.combination;
        const page = await Page.findOne({ page_router: `words-that-start-with/${combination}` }) || "";
        const morePosts = await Post.find({ status: 'Published' }).limit(3);
        const dictionary = 'wwf'; // default dictionary
        const letters = '';
        const length = '';
        const endsWith = '';
        const contains = '';
        const include = '';
        const exclude = '';
        let url = `https://fly.wordfinderapi.com/api/search?letters=${letters}&word_sorting=points&group_by_length=true&page_size=20000&dictionary=${dictionary}&starts_with=${combination}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (data && Array.isArray(data.word_pages)) {
            const wordsByLength = data.word_pages.reduce((acc, wordPage) => {
                let count = 0;
                wordPage.word_list.forEach(wordObj => {
                    const length = wordObj.word.length;
                    if (!acc[length]) {
                        acc[length] = [];
                    }
                    if (count < 15) {
                        acc[length].push(wordObj);
                        count++;
                    }
                });
                return acc;
            }, {});
            console.log("letters",letters ,"startsWith",combination, "specifiedLength",length, "endsWith",endsWith, "contains",contains, "includeLetters",include, "excludeLetters",exclude);
            res.render('frontend/words-that-start-with.ejs', { letters, morePosts, startsWith: combination, wordsByLength, specifiedLength: length, endsWith, contains, includeLetters: include, excludeLetters: exclude , page});
        } else {
            console.error('Error: Invalid data structure');
            res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/words-that-end-in/:combination', async (req, res) => {
    try {
        const combination = req.params.combination;
        const page = await Page.findOne({ page_router: `words-that-end-in/${combination}` }) || "";
        const morePosts = await Post.find({ status: 'Published' }).limit(3);
        const dictionary = 'wwf'; // default dictionary
        const letters = '';
        const length = '';
        const startsWith = '';
        const contains = '';
        const include = '';
        const exclude = '';
        let url = `https://fly.wordfinderapi.com/api/search?letters=${letters}&word_sorting=points&group_by_length=true&page_size=20000&ends_with=${combination}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (data && Array.isArray(data.word_pages)) {
            const wordsByLength = data.word_pages.reduce((acc, wordPage) => {
                let count = 0;
                wordPage.word_list.forEach(wordObj => {
                    const length = wordObj.word.length;
                    if (!acc[length]) {
                        acc[length] = [];
                    }
                    if (count < 15) {
                        acc[length].push(wordObj);
                        count++;
                    }
                });
                return acc;
            }, {});

            res.render('frontend/words-that-end-in.ejs', { letters, morePosts, startsWith, wordsByLength, specifiedLength: length, endsWith: combination, contains, includeLetters: include, excludeLetters: exclude , page});
        } else {
            console.error('Error: Invalid data structure');
            res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//words-by-length/:length
router.get('/:length-letter-words/', async (req, res) => {
    try {
        const length = req.params.length;
        const page = await Page.findOne({ page_router: `${length}-letter-words` }) || "";
        const morePosts = await Post.find({ status: 'Published' }).limit(3);
        const dictionary = 'wwf'; // default dictionary
        const letters = '';
        const startsWith = '';
        const endsWith = '';
        const contains = '';
        const include = '';
        const exclude = '';
        let url = `https://fly.wordfinderapi.com/api/search?letters=${letters}&word_sorting=points&group_by_length=true&page_size=20000&dictionary=${dictionary}&length=${length}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
         if (data && Array.isArray(data.word_pages)) {
            const wordsByLength = data.word_pages.reduce((acc, wordPage) => {
                let count = 0;
                wordPage.word_list.forEach(wordObj => {
                    const length = wordObj.word.length;
                    if (!acc[length]) {
                        acc[length] = [];
                    }
                    if (count < 30) {
                        acc[length].push(wordObj);
                        count++;
                    }
                });
                return acc;
            }, {});
            res.render('frontend/x-letter-words.ejs', { letters, morePosts, startsWith, wordsByLength, specifiedLength: length, endsWith, contains, includeLetters: include, excludeLetters: exclude ,page});
        } else {
            console.error('Error: Invalid data structure');
            res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//words-with/:startWith
router.get('/words-with/:contains', async (req, res) => {
    try {
        const contains = req.params.contains;
        const page = await Page.findOne({ page_router: `words-with/${contains}` }) || "";
        console.log("page.router",page.page_router);
        const morePosts = await Post.find({ status: 'Published' }).limit(3);
        const dictionary = 'wwf'; // default dictionary
        const letters = '';
        const length = '';
        const startsWith = '';
        const endsWith = '';
        const include = '';
        const exclude = '';
        let url = `https://fly.wordfinderapi.com/api/search?word_sorting=points&group_by_length=true&page_size=20000&contains=${contains}`;

        const response = await fetch(url);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log("Response data",data);
        if (data && Array.isArray(data.word_pages)) {
            const wordsByLength = data.word_pages.reduce((acc, wordPage) => {
                let count = 0;
                wordPage.word_list.forEach(wordObj => {
                    const length = wordObj.word.length;
                    if (!acc[length]) {
                        acc[length] = [];
                    }
                    if (count < 15) {
                        acc[length].push(wordObj);
                        count++;
                    }
                });
                return acc;
            }, {});
            console.log("letters",letters ,"startsWith",startsWith,"specifiedLength",length, "endsWith",endsWith, "contains",contains, "includeLetters",include, "excludeLetters",exclude);
            res.render('frontend/words-with.ejs', { letters, morePosts, startsWith, wordsByLength, specifiedLength: length, endsWith, contains, includeLetters: include, excludeLetters: exclude , page});
        } else {
            console.error('Error: Invalid data structure');
            res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//words-with/:contains/and/:containsletter2
router.get('/words-with/:contains_char1/and/:contains_char2', async (req, res) => {
    try {
        const contains_char1 = req.params.contains_char1;
        const contains_char2 = req.params.contains_char2;
        const page = await Page.findOne({ page_router: `words-with/${contains_char1}/and/${contains_char2}` }) || "";
        console.log("page.router",page.page_router);
        const morePosts = await Post.find({ status: 'Published' }).limit(3);
        const dictionary = ''; // default dictionary
        const letters = '';
        const contains = '';
        const length = '';
        const startsWith = '';
        const endsWith = '';
        const include = '';
        const exclude = '';
        let url = `https://fly.wordfinderapi.com/api/search?word_sorting=points&group_by_length=true&page_size=20000&dictionary=wwf&contains_char1=${contains_char1}&contains_char2=${contains_char2}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (data && Array.isArray(data.word_pages)) {
            const wordsByLength = data.word_pages.reduce((acc, wordPage) => {
                let count = 0;
                wordPage.word_list.forEach(wordObj => {
                    const length = wordObj.word.length;
                    if (!acc[length]) {
                        acc[length] = [];
                    }
                    if (count < 15) {
                        acc[length].push(wordObj);
                        count++;
                    }
                });
                return acc;
            }, {});
            res.render('frontend/words-with.ejs', { letters, morePosts, startsWith, wordsByLength, specifiedLength: length, endsWith, contains,contains_char1,contains_char2, includeLetters: include, excludeLetters: exclude , page});
        } else {
            console.error('Error: Invalid data structure');
            res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}); 

router.get('/articles/:title', async (req, res) => {
    try {
        const title = decodeURIComponent(req.params.title.trim());
        console.log('Searching for post with title:', title);
        const post = await Post.findOne({ title: title }).populate('author');
        
        const categories = await Category.find(); // Fetch the categories
        const morePosts = await Post.find({ status: 'Published' }).limit(3); // Fetch 3 more posts with a status of 'Published'
        const postUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        // Generate the share URLs for all platforms
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`;
        const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`;
        console.log(post.author ? post.author.username : 'unknown'); // Prints the username of the author or 'unknown' if the author doesn't exist
        res.render('post/article-details', { post, categories, morePosts, postTitle: post.title, postUrl, facebookShareUrl, twitterShareUrl, linkedinShareUrl }); // Pass the categories and morePosts to the template
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/articles', async (req, res) => {
    try {
        const posts = await Post.find({ status: 'Published' }); // Fetch all posts from the database
        res.render('post/articles', { morePosts: posts }); // Render the articles.ejs view with the posts data
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
router.get('/contact', (req, res) => {
    res.render(('frontend/contact.ejs'));
});
router.get('/privacy-policy', (req, res) => {
    res.render(('frontend/privacy-policy.ejs'));
});

router.get('/word-definition', wrapAsync(async (req, res) => {
    const word = req.query.word;
    const options = {
        method: 'GET',
        url: `https://dict-api.com/api/od/${word}`,
    };
    try {
        const response = await axios.request(options);
        console.log(response.data);
        res.json(response.data); // Send the response back to the client
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' }); // Send an error response
    }
}));

router.get('/:page_router', wrapAsync(async (req, res) => {
    const page = await Page.findOne({ page_name: req.params.page_name }).populate('sections');
    res.render('section/show-page.ejs', { page, user: req.user });
}));

// Example route for serving input.css
router.get('/input', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'input.css'));
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs');
});

module.exports = router;
