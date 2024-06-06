// test/middleware/user-activity.test.js
const express = require('express');
const logUserActivity = require('../../middleware/user-activity');
const UserActivity = require('../../models/user-activity');
const geoip = require('geoip-lite');

jest.mock('../../models/user-activity');
jest.mock('geoip-lite');

describe('logUserActivity middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      ip: '127.0.0.1',
      user: { username: 'testuser' }
    };
    res = {};
    next = jest.fn();
    geoip.lookup.mockReturnValue({
      city: 'Test City',
      region: 'Test Region',
      country: 'Test Country'
    });

    // Mock the save method to return a resolved promise
    UserActivity.prototype.save = jest.fn().mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log user activity with valid geo data', async () => {
    const action = 'testAction';
    const middleware = logUserActivity(action);

    await middleware(req, res, next);

    expect(UserActivity).toHaveBeenCalledWith({
      username: 'testuser',
      ip: '127.0.0.1',
      location: 'Test City, Test Region, Test Country',
      action: 'testAction'
    });
    expect(UserActivity.prototype.save).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should log user activity with unknown location if geo data is unavailable', async () => {
    geoip.lookup.mockReturnValue(null); // Simulate geo data not found
    const action = 'testAction';
    const middleware = logUserActivity(action);

    await middleware(req, res, next);

    expect(UserActivity).toHaveBeenCalledWith({
      username: 'testuser',
      ip: '127.0.0.1',
      location: 'Unknown',
      action: 'testAction'
    });
    expect(UserActivity.prototype.save).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should log user activity as Guest if user is not logged in', async () => {
    req.user = null; // Simulate no logged-in user
    const action = 'testAction';
    const middleware = logUserActivity(action);

    await middleware(req, res, next);

    expect(UserActivity).toHaveBeenCalledWith({
      username: 'Guest',
      ip: '127.0.0.1',
      location: 'Test City, Test Region, Test Country',
      action: 'testAction'
    });
    expect(UserActivity.prototype.save).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });
});
