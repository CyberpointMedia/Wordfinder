const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const app = express();
const router = require('../../routes/library');

jest.setTimeout(30000); // Increase timeout for all tests

// Set environment variables
process.env.YOUR_BUCKET_NAME = 'mocked-bucket';
process.env.AWS_REGION = 'us-east-1';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Mock AWS S3
jest.mock('aws-sdk', () => {
  const S3 = {
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({ Location: 'mocked-location' }),
    deleteObject: jest.fn().mockReturnThis(),
    promise: jest.fn().mockResolvedValue({})
  };
  return { S3: jest.fn(() => S3) };
});

// Mock multer-s3
jest.mock('multer-s3', () => {
  return jest.fn(() => {
    return {
      _handleFile: jest.fn((req, file, cb) => {
        cb(null, { key: 'mocked-key', location: 'mocked-location' });
      }),
      _removeFile: jest.fn((req, file, cb) => {
        cb(null);
      })
    };
  });
});

// Configure multer
const s3 = new AWS.S3({ region: process.env.AWS_REGION });
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.YOUR_BUCKET_NAME,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    }
  })
});

app.use(router);

describe('Library Routes', () => {
  it('GET /images should return 200', async () => {
    const res = await request(app).get('/images').send();
    expect(res.statusCode).toEqual(200);
  });

  it('GET /image/:id should return 200 for existing image', async () => {
    const existingImageId = 'existingImageId'; // replace with an actual image id
    const res = await request(app).get(`/image/${existingImageId}`).send();
    expect(res.statusCode).toEqual(200);
  });

  it('GET /image/:id should return 404 for non-existing image', async () => {
    const nonExistingImageId = 'nonExistingImageId'; // replace with a non-existing image id
    const res = await request(app).get(`/image/${nonExistingImageId}`).send();
    expect(res.statusCode).toEqual(404);
  });

  it('POST /upload should return 200 for successful upload', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', 'uploads/devops-image.jpg') // replace with the path to your image
      .set('Content-Type', 'multipart/form-data');
    expect(res.statusCode).toEqual(200);
  });

  it('POST /upload-multiple should return 200 for successful upload', async () => {
    const res = await request(app)
      .post('/upload-multiple')
      .attach('files', 'uploads/devops-image.jpg') // replace with the path to your image
      .attach('files', 'uploads/devops-image.jpg') // replace with the path to your image
      .set('Content-Type', 'multipart/form-data');
    expect(res.statusCode).toEqual(200);
  });

  it('DELETE /image/:id should return 200 for successful deletion', async () => {
    const existingImageId = 'existingImageId'; // replace with an actual image id
    const res = await request(app).delete(`/image/${existingImageId}`).send();
    expect(res.statusCode).toEqual(200);
  });

  it('DELETE /image/:id should return 404 for non-existing image', async () => {
    const nonExistingImageId = 'nonExistingImageId'; // replace with a non-existing image id
    const res = await request(app).delete(`/image/${nonExistingImageId}`).send();
    expect(res.statusCode).toEqual(404);
  });

  it('should return 404 for non-existing route', async () => {
    const res = await request(app).get('/non-existing-route').send();
    expect(res.statusCode).toEqual(404);
  });
});
