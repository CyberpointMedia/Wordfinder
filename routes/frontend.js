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
const ShowMenu = require('../models/show-menu');
const Appearance = require('../models/appearance');
const fetch = require('node-fetch');
const visitCounter = require('../middleware/visitCounter');
const readingTime = require('reading-time');
const mongoose = require('mongoose');
const { url } = require('inspector');
const setAdminStatusAndUsername = require('../middleware/setAdminStatusAndUsername');
const fetchPageAndMorePosts = require('../middleware/fetchPageAndMorePosts');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const nodemailer = require('nodemailer');
require('dotenv').config();
// Use the middleware in your application
router.use(setAdminStatusAndUsername);
// Middleware to fetch page and morePosts
router.use(fetchPageAndMorePosts);

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
        res.render('frontend/index.ejs',);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});

//wordle
router.get('/wordle', visitCounter, async (req, res) => {
    try {
        console.log("wordle open ");
        res.render('frontend/wordle.ejs',);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});

//scrabble-dictionary
router.get('/scrabble-dictionary', visitCounter, async (req, res) => {
    try {
        console.log("get scrabble-dictionary");
        res.render('frontend/scrabble-dictionary.ejs');
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/scrabble-dictionary', (req, res) => {
    console.log("post scrabble-dictionary");
    const word = req.body.letters;
    res.redirect(`/dictionary/${word}`);
});

router.get('/dictionary/:word', async (req, res) => {
    const word = req.params.word;
    const options = {
        method: 'GET',
        url: `https://dict-api.com/api/od/${word}`,
    };
    try {
        const response = await axios.request(options);
        const data = response.data;
        const morePosts = await Post.find({ status: 'Published' }).limit(3);

        if (data === null) {
            res.render('frontend/scrabble-dictionary_output.ejs', { data: null,pageId: req.page ? req.page._id : null});
        } else {
            // Extract the relevant data from the API response
            const result = data.results[0];
            const lexicalEntry = result.lexicalEntries[0];
            const entry = lexicalEntry.entries[0];
            const sense = entry.senses[0];

            const wordData = {
                word: result.word,
                lexicalCategory: lexicalEntry.lexicalCategory.text,
                definition: sense.definitions[0],
                examples: sense.examples.map(example => example.text),
                synonyms: sense.synonyms.map(synonym => synonym.text),
            };
            res.render('frontend/scrabble-dictionary_output.ejs', { data: wordData,pageId: req.page ? req.page._id : null});
        }
    } catch (error) {
        console.error(error);
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

router.post('/send-email', upload.single('fileBrowse'), (req, res) => {
    console.log('req.body send email is called:', req.body);
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'services@cyberpointmedia.com',
        pass: 'untnogualcpwgohn'
      }
    });
  
    let mailOptions = {
        from: 'services@cyberpointmedia.com',
        to: 'ekansh@cyberpointmedia.com, sanjay@cyberpointmedia.com',
        subject: 'Share Your Thoughts',
        text: `Email: ${req.body.emailId}\n\nThoughts: ${req.body.commentDetails}`,
        attachments: req.file ? [{
          path: req.file.path
        }] : []
      };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Error sending email');
      } else {
        console.log('Email sent: ' + info.response);
        res.render('frontend/index.ejs');
      }
    });
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
        const dictionary = req.body.scrabble_type || 'wwf'; // default dictionary
        let url = `https://fly.wordfinderapi.com/api/search?letters=${letters.toLowerCase()}&word_sorting=points&group_by_length=true&page_size=20000&dictionary=wwf`;

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
        const allLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        const index = allLetters.indexOf(combination);
        const surroundingLetters = allLetters.slice(Math.max(0, index - 1), Math.min(allLetters.length, index + 4));
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
            res.render('frontend/words-that-start-with.ejs', { letters, morePosts, startsWith: combination, wordsByLength, specifiedLength: length, endsWith, contains, includeLetters: include, excludeLetters: exclude , page, surroundingLetters});
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
        const allLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        const index = allLetters.indexOf(combination);
        const surroundingLetters = allLetters.slice(Math.max(0, index - 1), Math.min(allLetters.length, index + 4));
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

            res.render('frontend/words-that-end-in.ejs', { letters, morePosts, startsWith, wordsByLength, specifiedLength: length, endsWith: combination, contains, includeLetters: include, excludeLetters: exclude , page , surroundingLetters});
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
        const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'administrator');
        const dictionary = 'wwf'; // default dictionary
        const letters = '';
        const startsWith = req.query.starts_with || '';
        const endsWith = req.query.end_with || '';
        const contains = req.query.contains || '';
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
            res.render('frontend/x-letter-words.ejs', { letters, morePosts, startsWith, wordsByLength, specifiedLength: length, endsWith, contains, includeLetters: include, excludeLetters: exclude ,page ,isAdmin ,isAdmin: req.isAdmin,username: req.username ,pageId: req.page ? req.page._id : null});
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

//words-with/:must_contain/without/:must_not_contain
router.get('/words-with/:must_contain/without/:must_not_contain', async (req, res) => {
    try {
        console.log("words-with/:must_contain/without/:must_not_contain");
        const must_contain = req.params.must_contain;
        const must_not_contain = req.params.must_not_contain;
        const page = await Page.findOne({ page_router: `words-with/${must_contain}/and/${must_not_contain}` }) || "";
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
        let url = `https://fly.wordfinderapi.com/api/search?word_sorting=points&group_by_length=true&page_size=20000&dictionary=wwf&must_contain=${must_contain}&must_not_contain=${must_not_contain}`;

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
            res.render('frontend/words_with_x_without_y.ejs', { letters, morePosts, startsWith, wordsByLength, specifiedLength: length, endsWith, contains, must_contain, must_not_contain, includeLetters: include, excludeLetters: exclude , page});
        } else {
            console.error('Error: Invalid data structure');
            res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});  

// words_that_start_with_x_end_with_y
router.get('/words-that-start-with/:start_with/end-with/:end_with', async (req, res) => {
    try {
        const startsWith = req.params.start_with;
        const endsWith = req.params.end_with;
        console.log("/words-that-start-with/:start-with/end-with/:end-with");
        const page = await Page.findOne({ page_router: `words-that-start-with/${startsWith}/end-with/${endsWith}` }) || "";
        console.log("page.router",page.page_router);
        const morePosts = await Post.find({ status: 'Published' }).limit(3);
        const dictionary = 'ww'; // default dictionary
        const letters = '';
        const contains = '';
        const length = '';
        const include = '';
        const exclude = '';
        let url = `https://fly.wordfinderapi.com/api/search?word_sorting=points&group_by_length=true&page_size=20000&dictionary=wwf&starts_with=${startsWith}&ends_with=${endsWith}`;

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
            res.render('frontend/words_that_start_with_x_end_with_y.ejs', { letters, morePosts, startsWith, wordsByLength, specifiedLength: length, endsWith, contains, includeLetters: include, excludeLetters: exclude , page});
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
        if (!post) {
            console.error('No post found with title:', title);
            return res.status(404).send('Post not found');
          }
         // Calculate reading time
         const stats = readingTime(post.description);
         post.readingTime = stats.text;
         await post.save();
                 
        const categories = await Category.find(); // Fetch the categories
        const morePosts = await Post.find({ status: 'Published' }).limit(3); // Fetch 3 more posts with a status of 'Published'
        const postUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        // Generate the share URLs for all platforms
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`;
        const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(post.title)}`;
        console.log(post.author ? post.author.username : 'unknown'); // Prints the username of the author or 'unknown' if the author doesn't exist
        res.render('post/article-details', { post, categories, morePosts, postTitle: post.title, postUrl, facebookShareUrl, twitterShareUrl, linkedinShareUrl , readingTime: stats.text}); // Pass the categories and morePosts to the template
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/articles', async (req, res) => {
    try {
        const page = req.params.page || 1; // Get the page number from the request parameters
        const limit = 9; // Set the number of posts per page
        const skip = (page - 1) * limit; // Calculate the number of posts to skip

        const posts = await Post.find({ status: 'Published' }).skip(skip).limit(limit); // Fetch posts from the database with pagination
        const totalPosts = await Post.countDocuments({ status: 'Published' }); // Get the total number of posts

        res.render('post/articles', { morePosts: posts, currentPage: page, totalPages: Math.ceil(totalPosts / limit),totalPosts:totalPosts  }); // Render the articles.ejs view with the posts data and pagination info
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error',err);
    }
});
router.get('/articles/page/:page?', async (req, res) => {
    try {
        const page = req.params.page || 1; // Get the page number from the request parameters
        const limit = 9; // Set the number of posts per page
        const skip = (page - 1) * limit; // Calculate the number of posts to skip

        const posts = await Post.find({ status: 'Published' }).skip(skip).limit(limit); // Fetch posts from the database with pagination
        const totalPosts = await Post.countDocuments({ status: 'Published' }); // Get the total number of posts

        res.render('post/articles', { morePosts: posts, currentPage: page, totalPages: Math.ceil(totalPosts / limit),totalPosts:totalPosts  }); // Render the articles.ejs view with the posts data and pagination info
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error',err);
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
    console.log("Page router:", req.params.page_router); // Log the page_router
    const page = await Page.findOne({ page_router: req.params.page_router }).populate('sections');
    if (!page) {
        return res.status(404).render('not-found/page-not-found.ejs');
    }
    res.render('section/show-page.ejs', { page, user: req.user });
}));

// Example route for serving input.css
router.get('/input', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'input.css'));
});

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs',err);
});

module.exports = router;
