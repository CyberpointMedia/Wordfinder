// footer.test.js
// Mock multer and multer-s3
jest.mock('multer', () => {
    return function() {
      return {
        single: jest.fn()
      }
    }
});
// Set the environment variable
process.env.YOUR_BUCKET_NAME = 'test-bucket';

jest.mock('multer-s3', () => ({
  __esModule: true, // this property makes it work
  default: (opts) => ({
    _handleFile: (req, file, cb) => {
      cb(null, {
        bucket: opts.bucket,
        key: 'test-key',
        location: 'test-location'
      });
    },
    _removeFile: (req, file, cb) => {
      cb(null);
    }
  })
}));
// Set the environment variable
process.env.YOUR_BUCKET_NAME = 'test-bucket';

const request = require('supertest');
const server = require('../server');

describe('Footer', () => {
  // Test the GET route
  describe('/GET widgets', () => {
    it('should GET all the widgets', async () => {
      const res = await request(server).get('/footer/widgets');
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });
  });

  // Test the POST route
  describe('/POST addtexteditor', () => {
    it('should POST a widget', async () => {
      let widget = {
          name: 'Text Editor',
          column: 'footerCol1'
      }
      const res = await request(server).post('/footer/addtexteditor').send(widget);
      expect(res.statusCode).toEqual(200);
      expect(typeof res.body).toBe('object');
      expect(res.body.message).toEqual('Text Editor Widget added successfully');
    });
  });

  // Add more tests for other routes
});