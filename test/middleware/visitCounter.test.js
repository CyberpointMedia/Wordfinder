// test/visitCounter.test.js

const request = require('supertest');
const express = require('express');
const visitCounter = require('../../middleware/visitCounter');
const Visit = require('../../models/visitcount');

jest.mock('../../models/visitcount');

describe('visitCounter', () => {
  it('should count visits', async () => {
    const app = express();
    app.use(visitCounter);
    app.get('/', (req, res) => res.status(200).send());

    const mockVisit = { visitCount: 0, save: jest.fn().mockResolvedValue() };
    Visit.findOne.mockResolvedValue(mockVisit);

    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(mockVisit.visitCount).toEqual(1);
    expect(mockVisit.save).toHaveBeenCalled();
  });

  it('should handle when visit is not found', async () => {
    const app = express();
    app.use(visitCounter);
    app.get('/', (req, res) => res.status(200).send());

    const mockVisit = { visitCount: 0, save: jest.fn().mockResolvedValue() };
    Visit.findOne.mockResolvedValue(null);
    Visit.mockImplementation(() => mockVisit);

    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(mockVisit.visitCount).toEqual(1);
    expect(mockVisit.save).toHaveBeenCalled();
  });

  // Add more tests for other cases...
});