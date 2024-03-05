const request = require('supertest');
const server = require('./app'); // replace with path to your Express app

afterEach(() => {
  server.close();
});

describe('POST /library/upload', () => {
  it('responds with json', async () => {
    const response = await request(server)
      .post('/library/upload')
      .attach('files', 'C:\\Users\\sanja\\Desktop\\Wordfinder\\uploads\\1708843053155-Screenshot 2024-02-24 224419.png') // replace with path to a test file
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    // Add more assertions as needed
  });
});