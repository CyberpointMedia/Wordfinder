//route/frontend.js
const express = require('express');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser'); 
const router = express.Router();
const PORT = process.env.PORT || 8080;
var wd = require("word-definition");
const axios = require('axios');
const wrapAsync = require('../middleware/wrapAsync');
const Post = require('../models/post');
const Category = require('../models/categories'); 
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(404).render('not-found/page-not-found.ejs');
});
// Middleware to parse incoming request bodies
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// // Serve static files from the 'dist' directory
router.use(express.static(path.join(__dirname, 'dist')));
// Serve static files from the node_modules directory
router.use('/node_modules', express.static(__dirname + '/node_modules'));

// // Define routes

router.get('/', async (req, res) => {
    try {
        console.log("hello sir ");
        
        // const categories = await Category.find(); // Fetch the categories
        const morePosts = await Post.find().limit(3); // Fetch 3 more posts
        res.render('frontend/index.ejs', { morePosts }); // Pass morePosts to the template

    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/5-letter-words', (req, res) => {
    res.render(('frontend/5-letter-words.ejs'));
  });

router.get('/articles/:title', async (req, res) => {
    try {
        const post = await Post.findOne({ title: req.params.title });
        if (!post) {
            return res.status(404).send('Post not found');
        }
        const categories = await Category.find(); // Fetch the categories
        const morePosts = await Post.find({ _id: { $ne: post._id } }).limit(3); // Fetch 3 more posts excluding the current one
        res.render('post/article-details', { post, categories, morePosts}); // Pass the categories and morePosts to the template
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.get('/articles', async (req, res) => {
    try {
        const posts = await Post.find(); // Fetch all posts from the database
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
router.get('/result', (req, res) => {
    res.render(('frontend/result.ejs'));
});
router.get('/words-with-X-and-Q', (req, res) => {
    res.render(('frontend/words-with-X-and-Q.ejs'));
});

// Handle POST request when search button is clicked
router.post('/search', wrapAsync(async (req, res) => {
  const letters = req.body.letters;
  const startsWith = req.body.starts_with || '';
  const endsWith = req.body.end_with || '';
  const contains = req.body.contains || ''; 
  const specifiedLength = req.body.length || ''; 
  console.log("LEngth of the words",specifiedLength);
  let url = `https://httpip.es/api/words?letters=${letters}`;
  // If starts_with parameter is provided, modify the URL to include it
  if (startsWith.trim() !== '') {
      url += `&starts_with=${startsWith}`;
  }
  if (endsWith.trim() !== '') {
      url += `&ends_with=${endsWith}`;
  }
  if (contains.trim() !== '') {
      url += `&contains=${contains}`;
  }
  if (specifiedLength.trim() !== '') { 
      url += `&length=${specifiedLength}`;
  }
  https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
          data += chunk;
      });

      response.on('end', () => {
          const responseData = JSON.parse(data);
          const words = responseData.data;

          // Group words by their length
          const wordsByLength = {};
          words.forEach(word => {
              const wordLength = word.length;
              if (!wordsByLength[wordLength]) {
                  wordsByLength[wordLength] = [];
              }
              wordsByLength[wordLength].push(word);
          });
          
          // Calculate the total number of words for each length
          const totalWordsByLength = {};
          Object.keys(wordsByLength).forEach(length => {
              totalWordsByLength[length] = wordsByLength[length].length;
          });

          // Render the words_with_x_and_q.ejs template with the grouped data
          res.render('frontend/words-with-X-and-Q.ejs', { letters, wordsByLength ,startsWith ,endsWith, contains,specifiedLength,totalWordsByLength}); // Pass 'letters' and 'wordsByLength' variables here
      });
  }).on('error', (error) => {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
  });
}));

router.get('/word-definition', wrapAsync(async (req, res) => {
  const word = req.query.word;

  const options = {
      method: 'GET',
      url: `https://wordsapiv1.p.rapidapi.com/words/${word}`,
      headers: {
          'X-RapidAPI-Key': process.env.Key,
          'X-RapidAPI-Host': process.env.Host
      }
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


// Example route for serving input.css
router.get('/input', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'input.css'));
});

module.exports = router;