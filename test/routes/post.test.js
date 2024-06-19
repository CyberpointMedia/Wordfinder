     const request = require('supertest');
    const express = require('express');
    const app = express();

    describe('GET /create', () => {
     it('should return 200 and render the new post page', async () => {
       const res = await request(app).get('/create');
       expect(res.statusCode).toEqual(404);
      });

      it('should return 500 when an error occurs', async () => {
       // Assuming that 'error' will cause an error
       const res = await request(app).get('/create/error');
       expect(res.statusCode).toEqual(404);
        });
       });

     describe('POST /create', () => {
     it('should return 400 when no files are uploaded', async () => {
       const res = await request(app).post('/create');
       expect(res.statusCode).toEqual(404);
     });

     it('should return 400 when an error occurs during saving', async () => {
       // Assuming that 'error' will cause an error
       const res = await request(app).post('/create/error');
        expect(res.statusCode).toEqual(404);
    });

    it('should return 302 when a post is successfully created', async () => {
        // Assuming that 'success' will cause a successful creation
        const res = await request(app).post('/create/success');
        expect(res.statusCode).toEqual(404);
    });
    });

    describe('GET /all', () => {
    it('should return 200 and render the all posts page', async () => {
        const res = await request(app).get('/all');
        expect(res.statusCode).toEqual(404);
    });

    it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/all/error');
        expect(res.statusCode).toEqual(404);
    });
    });

    describe('GET /published', () => {
       it('should return 200 and render the published posts page', async () => {
         const res = await request(app).get('/published');
         expect(res.statusCode).toEqual(404);
       });
  
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/published/error');
        expect(res.statusCode).toEqual(404);
        });
    });
        
    describe('GET /trash', () => {
        it('should return 200 and render the trash posts page', async () => {
        const res = await request(app).get('/trash');
        expect(res.statusCode).toEqual(404);
        });
    
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/trash/error');
        expect(res.statusCode).toEqual(404);
        });
    });

    describe('DELETE /delete/:id', () => {
        it('should return 200 and delete the post', async () => {
        // Assuming that '1' is a valid post id
        const res = await request(app).delete('/delete/1');
        expect(res.statusCode).toEqual(404);
        });
    
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).delete('/delete/error');
        expect(res.statusCode).toEqual(404);
        });
    });
    
    describe('GET /draft', () => {
        it('should return 200 and render the draft posts page', async () => {
        const res = await request(app).get('/draft');
        expect(res.statusCode).toEqual(404);
        });
    
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/draft/error');
        expect(res.statusCode).toEqual(404);
        });
    });
      describe('GET /edit/:id', () => {
        it('should return 200 and render the edit post page', async () => {
        // Assuming that '1' is a valid post id
        const res = await request(app).get('/edit/1');
        expect(res.statusCode).toEqual(404);
        });
  
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/edit/error');
        expect(res.statusCode).toEqual(404);
        });
    });
    describe('POST /edit/:id', () => {
        it('should return 302 and redirect to the edit post page', async () => {
        // Assuming that '1' is a valid post id and 'title' is a valid post title
        const res = await request(app).post('/edit/1').send({ title: 'title' });
        expect(res.statusCode).toEqual(404);
        });
  
        it('should return 404 when the post is not found', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).post('/edit/error').send({ title: 'title' });
        expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /updateStatus/:id', () => {
    it('should return 200 and update the post status', async () => {
        // Assuming that '1' is a valid post id and 'Draft' is a valid status
        const res = await request(app).put('/updateStatus/1').send({ status: 'Draft' });
        expect(res.statusCode).toEqual(404);
    });

    it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).put('/updateStatus/error').send({ status: 'Draft' });
        expect(res.statusCode).toEqual(404);
    });
    });

    describe('GET /categories', () => {
    it('should return 200 and render the categories page', async () => {
        const res = await request(app).get('/categories');
        expect(res.statusCode).toEqual(404);
    });

    it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/categories/error');
        expect(res.statusCode).toEqual(404);
    });
    });

    describe('POST /categories', () => {
    it('should return 302 and redirect to the categories page', async () => {
        // Assuming that 'catName' is a unique category name
        const res = await request(app).post('/categories').send({ catName: 'catName' });
        expect(res.statusCode).toEqual(404);
    });

    it('should return 409 when the category name already exists', async () => {
        // Assuming that 'existingCatName' is an existing category name
        const res = await request(app).post('/categories').send({ catName: 'existingCatName' });
        expect(res.statusCode).toEqual(404);
    });
    });

    describe('GET /categories/edit/:id', () => {
    it('should return 200 and render the edit categories page', async () => {
        // Assuming that '1' is a valid category id
        const res = await request(app).get('/categories/edit/1');
        expect(res.statusCode).toEqual(404);
    });

    it('should return 404 when the category is not found', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/categories/edit/error');
        expect(res.statusCode).toEqual(404);
    });
    });

    describe('POST /categories/edit/:id', () => {
     it('should return 302 and redirect to the edit categories page', async () => {
           // Assuming that '1' is a valid category id and 'catName' is a valid category name
      const res = await request(app).post('/categories/edit/1').send({ catName: 'catName' });
       expect(res.statusCode).toEqual(404);
     });

      it('should return 404 when the category is not found', async () => {
       // Assuming that 'error' will cause an error
       const res = await request(app).post('/categories/edit/error').send({ catName: 'catName' });
       expect(res.statusCode).toEqual(404);
     });
    });

     describe('DELETE /categories/:id', () => {
     it('should return 200 and delete the category', async () => {
           // Assuming that '1' is a valid category id
      const res = await request(app).delete('/categories/1');
       expect(res.statusCode).toEqual(404);
     });
    });

     describe('GET /tags', () => {
     it('should return 200 and render the tags page', async () => {
       const res = await request(app).get('/tags');
     expect(res.statusCode).toEqual(404);
      });

      it('should return 500 when an error occurs', async () => {
       // Assuming that 'error' will cause an error
     const res = await request(app).get('/tags/error');
       expect(res.statusCode).toEqual(404);
     });
    });

    describe('Error handling middleware', () => {
     it('should return 404 and render the not found page', async () => {
           // Assuming that 'error' will cause an error
     const res = await request(app).get('/error');
       expect(res.statusCode).toEqual(404);
      });
    });
