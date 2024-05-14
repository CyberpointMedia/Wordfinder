    // library.test.js
    const request = require('supertest');
    const express = require('express');
    const app = express();
    const router = require('../../routes/library'); // adjust the path as needed

      app.use(router);

      describe('Library Routes', () => {
       it('GET /images should return 200', async () => {
        const res = await request(app)
         .get('/images')
         .send();

       expect(res.statusCode).toEqual(200);
        });

     it('GET /image/:id should return 200 for existing image', async () => {
     const existingImageId = 'existingImageId'; // replace with an actual image id
     const res = await request(app)
       .get(`/image/${existingImageId}`)
       .send();

      expect(res.statusCode).toEqual(200);
    });

    it('GET /image/:id should return 404 for non-existing image', async () => {
      const nonExistingImageId = 'nonExistingImageId'; // replace with a non-existing image id
      const res = await request(app)
       .get(`/image/${nonExistingImageId}`)
        .send();

      expect(res.statusCode).toEqual(404);
    });


     it('POST /upload should return 200 for successful upload', async () => {
        const res = await request(app)
          .post('/upload')
          .attach('file', 'path/to/your/image.jpg') // replace with the path to your image
          .set('Content-Type', 'multipart/form-data');

        expect(res.statusCode).toEqual(200);
      });
  
      it('POST /upload-multiple should return 200 for successful upload', async () => {
        const res = await request(app)
        .post('/upload-multiple')
        .attach('files', 'path/to/your/image1.jpg') // replace with the path to your image
        .attach('files', 'path/to/your/image2.jpg') // replace with the path to your image
        .set('Content-Type', 'multipart/form-data');
    
        expect(res.statusCode).toEqual(200);
    });

    it('DELETE /image/:id should return 200 for successful deletion', async () => {
        const existingImageId = 'existingImageId'; // replace with an actual image id
        const res = await request(app)
        .delete(`/image/${existingImageId}`)
        .send();
    
        expect(res.statusCode).toEqual(200);
    });
  
    it('DELETE /image/:id should return 404 for non-existing image', async () => {
        const nonExistingImageId = 'nonExistingImageId'; // replace with a non-existing image id
        const res = await request(app)
        .delete(`/image/${nonExistingImageId}`)
        .send();
    
        expect(res.statusCode).toEqual(404);
    });
    
        it('should return 404 for non-existing route', async () => {
        const res = await request(app)
          .get('/non-existing-route')
          .send();
  
        expect(res.statusCode).toEqual(404);
        });
  
        });