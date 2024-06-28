const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Visit = require('../../models/visitcount'); // Adjust the path as necessary
const router = require('../../routes/visits'); // Adjust the path as necessary

const app = express();
app.use(express.json());
app.use('/', router);

describe('GET /visits', () => {
  beforeAll(async () => {
    // Connect to the in-memory database
    const url = `mongodb://127.0.0.1/visits_test_db`;
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Disconnect from the in-memory database
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await Visit.deleteMany({});
  });

  it('should return 200 and the visits data', async () => {
    // Seed the database with some visits data
    const visit1 = new Visit({ count: 1 });
    const visit2 = new Visit({ count: 2 });
    await visit1.save();
    await visit2.save();

    const res = await request(app).get('/visits');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].count).toEqual(1);
    expect(res.body[1].count).toEqual(2);
  });

  it('should return 500 if there is an error fetching visits data', async () => {
    // Mock the Visit.find method to throw an error
    jest.spyOn(Visit, 'find').mockImplementationOnce(() => {
      throw new Error('Test error');
    });

    const res = await request(app).get('/visits');
    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toEqual('Test error');
  });
});
