const express = require('express');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser'); 
const app = express();
const PORT = process.env.PORT || 3000;
var wd = require("word-definition");

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set the 'views' directory for EJS templates
app.set('views', path.join(__dirname, 'dist/views'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));
// Serve static files from the node_modules directory
app.use('/node_modules', express.static(__dirname + '/node_modules'));

// Define routes

app.get('/', (req, res) => {
  res.render(('index.ejs'));
});
app.get('/5-letter-words', (req, res) => {
    res.render(('5-letter-words.ejs'));
  });
app.get('/article-details', (req, res) => {
    res.render(('article-details.ejs'));
  });
app.get('/articles', (req, res) => {
    res.render(('articles.ejs'));
});
app.get('/contact', (req, res) => {
    res.render(('contact.ejs'));
});
app.get('/privacy-policy', (req, res) => {
    res.render(('privacy-policy.ejs'));
});
app.get('/result', (req, res) => {
    res.render(('result.ejs'));
});
app.get('/words-with-X-and-Q', (req, res) => {
    res.render(('words-with-X-and-Q.ejs'));
});

// Handle POST request when search button is clicked
app.post('/search', (req, res) => {
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
      res.render('words-with-X-and-Q.ejs', { letters, wordsByLength ,startsWith ,endsWith, contains,specifiedLength,totalWordsByLength}); // Pass 'letters' and 'wordsByLength' variables here
    });
  }).on('error', (error) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  });

});
app.get('/word-definition', (req, res) => {
  // Retrieve the word from the query parameter
  const word = req.query.word;

  // Fetch the definition of the word
  wd.getDef(word, "en", null, function(definition) {
    console.log("word:", word, "defination",definition);
      // Send the definition as a JSON response
      res.json({ word: word, definition: definition });
  });
});


// Example route for serving input.css
app.get('/input', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'input.css'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
