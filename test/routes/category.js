// // test/category.test.js
 const request = require('supertest');
 const express = require('express');
 const app = express();
 const router = require('../../routes/category');

 app.use(express.urlencoded({ extended: false }));
 app.use('/', router);

   describe('Category Route', () => {
   it('GET /words-that-start-with should return combinations of words', async () => {
     const res = await request(app).get('/words-that-start-with');

     expect(res.statusCode).toEqual(200);
     // Add more assertions based on what you expect to be in the response
   });

   it('GET /words-that-start-with should handle errors', async () => {
    // Mock an error
     const mockError = new Error('Test error');
     jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject(mockError)
    );

    const res = await request(app).get('/words-that-start-with');

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual('An error occurred while processing your request.');
  });

  it('GET /words-that-end-in should return combinations of words', async () => {
    const res = await request(app).get('/words-that-end-in');

  expect(res.statusCode).toEqual(200);
     // Add more assertions based on what you expect to be in the response
   });

   it('GET /words-that-end-in should handle errors', async () => {
     // Mock an error
     const mockError = new Error('Test error');
     jest.spyOn(global, 'fetch').mockImplementation(() =>
       Promise.reject(mockError)
     );

     const res = await request(app).get('/words-that-end-in');

     expect(res.statusCode).toEqual(500);
     expect(res.text).toEqual('An error occurred while processing your request.');
   });

   it('GET /words-by-length should return lengths of words', async () => {
     const res = await request(app).get('/words-by-length');

     expect(res.statusCode).toEqual(200);
     // Add more assertions based on what you expect to be in the response
   });

   it('GET /words-by-length should handle errors', async () => {
     // Mock an error
    const mockError = new Error('Test error');
     jest.spyOn(global, 'fetch').mockImplementation(() =>
       Promise.reject(mockError)
     );

     const res = await request(app).get('/words-by-length');

     expect(res.statusCode).toEqual(500);
     expect(res.text).toEqual('An error occurred while processing your request.');
   });

   it('GET /words-with-letters should return combinations of letters', async () => {
     const res = await request(app).get('/words-with-letters');

     expect(res.statusCode).toEqual(200);
     // Add more assertions based on what you expect to be in the response
   });

   it('GET /words-with-letters should handle errors', async () => {
     // Mock an error
     const mockError = new Error('Test error');
     jest.spyOn(global, 'fetch').mockImplementation(() =>
       Promise.reject(mockError)
     );

     const res = await request(app).get('/words-with-letters');

     expect(res.statusCode).toEqual(500);
     expect(res.text).toEqual('An error occurred while processing your request.');
  });

  it('GET /words-with-letters should paginate the letters', async () => {
    const res = await request(app).get('/words-with-letters?page=2');

    expect(res.statusCode).toEqual(200);
    // Add more assertions based on what you expect to be in the response
  });

  it('GET /words-with-letters should handle errors when paginating', async () => {
    // Mock an error
    const mockError = new Error('Test error');
    jest.spyOn(global, 'fetch').mockImplementation(() =>
      Promise.reject(mockError)
    );

    const res = await request(app).get('/words-with-letters?page=2');

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual('An error occurred while processing your request.');
  });
});