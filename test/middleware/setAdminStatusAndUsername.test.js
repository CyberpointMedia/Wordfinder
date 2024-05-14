// test/setAdminStatusAndUsername.test.js

const request = require('supertest');
const express = require('express');
const setAdminStatusAndUsername = require('../../middleware/setAdminStatusAndUsername');

describe('setAdminStatusAndUsername', () => {
 it('should set isAdmin and username', async () => {
  const app = express();

  const mockUser = { role: 'admin', username: 'test' };
  app.use((req, res, next) => {
    req.user = mockUser;
    next();
  });

  app.use(setAdminStatusAndUsername);
  app.get('/', (req, res) => res.status(200).json({ isAdmin: res.locals.isAdmin, username: res.locals.username }));

  const res = await request(app).get('/');
  expect(res.body.isAdmin).toBe(true);
  expect(res.body.username).toBe('test');
});

  it('should handle when user is not authenticated', async () => {
    const app = express();
    app.use(setAdminStatusAndUsername);
    app.get('/', (req, res) => res.status(200).json({ isAdmin: res.locals.isAdmin, username: res.locals.username }));

    const res = await request(app).get('/');
    expect(res.body.isAdmin).toBe(undefined);
    expect(res.body.username).toBe(undefined);
  });
});