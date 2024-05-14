// test/middleware/authMiddleware.test.js

const request = require('supertest');
const express = require('express');
const { ensureAdmin, ensureAdminOrEditor, ensureEditor, ensureAuthor } = require('../../middleware/authMiddleware');

jest.mock('../../middleware/authMiddleware', () => ({
  ensureAdmin: (req, res, next) => req.isAuthenticated() && req.user.role === 'admin' ? next() : res.status(403).send('Forbidden'),
  ensureAdminOrEditor: (req, res, next) => req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'editor') ? next() : res.status(403).send('Forbidden'),
  ensureEditor: (req, res, next) => req.isAuthenticated() && req.user.role === 'editor' ? next() : res.status(403).send('Forbidden'),
  ensureAuthor: (req, res, next) => req.isAuthenticated() && req.user.role === 'author' ? next() : res.status(403).send('Forbidden'),
}));

// Mock Express app
const app = express();
app.use(express.json());

// Mock isAuthenticated method and user object
const mockIsAuthenticated = jest.fn();
const mockUser = { role: '' };
app.use((req, res, next) => {
  req.isAuthenticated = mockIsAuthenticated;
  req.user = mockUser;
  next();
});

// Mock routes for testing
app.get('/admin', ensureAdmin, (req, res, next) => {
  res.status(200).send('Admin');
}, (err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server Error');
});
app.get('/adminOrEditor', ensureAdminOrEditor, (req, res) => res.status(200).send('Admin or Editor'));
app.get('/editor', ensureEditor, (req, res) => res.status(200).send('Editor'));
app.get('/author', ensureAuthor, (req, res) => res.status(200).send('Author'));

describe('Auth Middleware', () => {
  it('should allow admin', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockUser.role = 'admin';

    const res = await request(app).get('/admin');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Admin');
  });

  it('should allow admin or editor', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockUser.role = 'editor';

    const res = await request(app).get('/adminOrEditor');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Admin or Editor');
  });

  it('should allow editor', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockUser.role = 'editor';

    const res = await request(app).get('/editor');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Editor');
  });

  it('should allow author', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockUser.role = 'author';

    const res = await request(app).get('/author');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Author');
  });
  // Add more tests for other roles and routes...
});