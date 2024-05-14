// frontend.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('../../routes/frontend');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);

describe('Frontend Route', () => {
  it('GET / should return 200', async () => {
    const res = await request(app)
      .get('/')
      .send();

    expect(res.statusCode).toEqual(200);
  },10000);

    it('GET /about should return 200', async () => {
        const res = await request(app)
        .get('/wordle')
        .send();
    
        expect(res.statusCode).toEqual(200);
    },10000);

    it('POST /guess should return 200 and a valid response', async () => {
        const res = await request(app)
          .post('/guess')
          .send({
            box1_contains_1: 'a',
            box1_contains_2: 'b',
            box1_contains_3: 'c',
            box1_contains_4: 'd',
            box1_contains_5: 'e',
            // ... other boxes ...
          });
    
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('guesses');
        expect(res.body).toHaveProperty('was_correct');
        expect(res.body).toHaveProperty('character_infos');
      });
      it('GET /scrabble-dictionary should return 200', async () => {
        const res = await request(app)
          .get('/scrabble-dictionary')
          .send();
    
        expect(res.statusCode).toEqual(200);
      });
    
      it('POST /scrabble-dictionary should return 302 and redirect', async () => {
        const res = await request(app)
          .post('/scrabble-dictionary')
          .send({ letters: 'testword' });
    
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual('/dictionary/testword');
      });
      
      it('GET /dictionary/:word should return 200', async () => {
        const res = await request(app)
          .get('/dictionary/testword')
          .send();
    
        expect(res.statusCode).toEqual(200);
      });

      it('GET /no-words-found should return 200', async () => {
        const res = await request(app)
          .get('/no-words-found')
          .send();
    
        expect(res.statusCode).toEqual(200);
      });
      it('POST /send-email should return 200', async () => {
        const res = await request(app)
          .post('/send-email')
          .attach('fileBrowse', 'test.txt')
          .field('emailId', 'test@example.com')
          .field('commentDetails', 'Test comment');
    
        expect(res.statusCode).toEqual(200);
      });
      it('POST /unscramble should return 302', async () => {
        const res = await request(app)
          .post('/unscramble')
          .send({
            letters: 'test',
            starts_with: '',
            end_with: '',
            contains: '',
            length: 0,
            include: '',
            exclude: '',
            scrabble_type: 'wwf'
          });
    
        expect(res.statusCode).toEqual(302);
    });
    it('GET /unscramble/:letters/dictionary/:dictionary should return 200', async () => {
        const res = await request(app)
          .get('/unscramble/test/dictionary/wwf')
          .send();
    
        expect(res.statusCode).toEqual(200);
      });

      it('GET /words-that-start-with/:combination should return 200', async () => {
        const res = await request(app)
          .get('/words-that-start-with/test')
          .send();
    
        expect(res.statusCode).toEqual(200);
      });

      it('GET /words-that-end-in/:combination should return 200', async () => {
        const res = await request(app)
          .get('/words-that-end-in/test')
          .send();
    
        expect(res.statusCode).toEqual(200);
      });

      it('GET /:length-letter-words/ should return 200', async () => {
        const res = await request(app)
          .get('/5-letter-words/')
          .send();
    
        expect(res.statusCode).toEqual(200);
      });
      it('GET /words-with/:contains should return 200', async () => {
        const res = await request(app)
          .get('/words-with/a')
          .send();
    
        expect(res.statusCode).toEqual(200);
      });

    it('GET /words-with/:contains_char1/and/:contains_char2 should return 200', async () => {
    const res = await request(app)
    .get('/words-with/a/and/b')
    .send();

    expect(res.statusCode).toEqual(200);
});

it('GET /words-with/:must_contain/without/:must_not_contain should return 200', async () => {
  const res = await request(app)
    .get('/words-with/a/without/b')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /words-that-start-with/:start_with/end-with/:end_with should return 200', async () => {
  const res = await request(app)
    .get('/words-that-start-with/a/end-with/b')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /articles/:title should return 200 for existing article', async () => {
  const res = await request(app)
    .get('/articles/Existing Article Title')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /articles/:title should return 404 for non-existing article', async () => {
  const res = await request(app)
    .get('/articles/Non-existing Article Title')
    .send();

  expect(res.statusCode).toEqual(404);
});

it('GET /articles should return 200', async () => {
  const res = await request(app)
    .get('/articles')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /articles/page/:page? should return 200 for existing page', async () => {
  const res = await request(app)
    .get('/articles/page/1')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /articles/page/:page? should return 200 even for non-existing page', async () => {
  const res = await request(app)
    .get('/articles/page/9999')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /contact should return 200', async () => {
  const res = await request(app)
    .get('/contact')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /privacy-policy should return 200', async () => {
  const res = await request(app)
    .get('/privacy-policy')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /terms-of-use should return 200', async () => {
  const res = await request(app)
    .get('/terms-of-use')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /cookie-policy should return 200', async () => {
  const res = await request(app)
    .get('/cookie-policy')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /word-definition should return 200 for existing word', async () => {
  const res = await request(app)
    .get('/word-definition?word=example')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /:page_router should return 200 for existing page', async () => {
  const res = await request(app)
    .get('/existing-page')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('GET /:page_router should return 404 for non-existing page', async () => {
  const res = await request(app)
    .get('/non-existing-page')
    .send();

  expect(res.statusCode).toEqual(404);
});

it('GET /input should return 200', async () => {
  const res = await request(app)
    .get('/input')
    .send();

  expect(res.statusCode).toEqual(200);
});

it('Error handling middleware should return 404', async () => {
  const res = await request(app)
    .get('/non-existing-route')
    .send();

  expect(res.statusCode).toEqual(404);
});

});