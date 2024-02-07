const express = require('express');
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser'); 
const app = express();
const PORT = process.env.PORT || 3000;

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
  const url = `https://httpip.es/api/words?letters=${letters}`;

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
        const length = word.length;
        if (!wordsByLength[length]) {
          wordsByLength[length] = [];
        }
        wordsByLength[length].push(word);
      });

      // Render the words_with_x_and_q.ejs template with the grouped data
      res.render('words-with-X-and-Q.ejs', { letters, wordsByLength }); // Pass 'letters' and 'wordsByLength' variables here
    });
  }).on('error', (error) => {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
