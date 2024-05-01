// test/userActivity.test.js

const request = require('supertest');
const express = require('express');
const logUserActivity = require('../../middleware/user-activity');
const UserActivity = require('../../models/user-activity');
const geoip = require('geoip-lite');

jest.mock('../../models/user-activity');
jest.mock('geoip-lite');

describe('logUserActivity', () => {
  it('should log user activity', async () => {
    const app = express();
    app.use(logUserActivity('Test action'));
    app.get('/', (req, res) => res.status(200).send());

    UserActivity.mockImplementation(() => ({ save: jest.fn().mockResolvedValue() }));
    geoip.lookup.mockReturnValue({ city: 'Test City', region: 'Test Region', country: 'Test Country' });

    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(UserActivity).toHaveBeenCalledWith({
      username: 'Guest',
      ip: expect.any(String),
      location: 'Test City, Test Region, Test Country',
      action: 'Test action'
    });
  });

  // Add more tests for other cases...
});