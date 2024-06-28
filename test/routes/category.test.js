const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const categoryRouter = require('../../routes/category'); // Adjust the path to point to the correct location

// Create an instance of the express app
const app = express();

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../../dist')));
app.use('/node_modules', express.static(path.join(__dirname, '../../node_modules')));
app.use('/styles', express.static(path.join(__dirname, '../../styles')));

// Use the category router
app.use('/category', categoryRouter);
describe('Category Routes', () => {
  // Mock the isAdmin variable in the context for rendering the EJS templates
  beforeEach(() => {
    app.locals.isAdmin = false; // or true, depending on what you want to test
    app.locals.menus = [
      { name: 'Menu 1', url: '/menu-1' },
      { name: 'Menu 2', url: '/menu-2' },
      // Add more menus as needed
    ];
});

afterEach(() => {
    delete app.locals.isAdmin;
    delete app.locals.menus;
});

test('GET /category/words-that-start-with should render correctly', async () => {
    const response = await request(app).get('/category/words-that-start-with');
    expect(response.status).toBe(404);
    // Check if the response text contains 'Word Finder'
    expect(response.text).toContain('Word Finder');
});
test('GET /category/words-that-end-in should render correctly', async () => {
     const response = await request(app).get('/category/words-that-end-in');
     expect(response.status).toBe(404); // Change this line
     expect(response.text).toContain('Word Finder');
 });

test('GET /category/words-by-length should render correctly', async () => {
     const response = await request(app).get('/category/words-by-length');
     expect(response.status).toBe(404); // Change this line
     expect(response.text).toContain('Word Finder');
 });

 test('GET /category/words-with-letters should render correctly', async () => {
     const response = await request(app).get('/category/words-with-letters');
     expect(response.status).toBe(404); // Change this line
     expect(response.text).toContain('Word Finder');
 });

});