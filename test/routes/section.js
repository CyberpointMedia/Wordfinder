    const request = require('supertest');
    const express = require('express');
    const app = express();

    describe('GET /create', () => {
    it('should return 200 and render the create section page', async () => {
        const res = await request(app).get('/create');
        expect(res.statusCode).toEqual(200);
    });

    it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/create/error');
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Internal Server Error');
    });
    });

    describe('POST /create', () => {
    it('should return 302 and redirect to the edit section page', async () => {
        // Assuming that 'title' is a valid title
        const res = await request(app).post('/create').send({ title: 'title' });
        expect(res.statusCode).toEqual(302);
        // Assuming that '1' is the id of the newly created section
        expect(res.headers.location).toEqual('/admin/section/edit/1');
    });

    it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).post('/create/error').send({ title: 'title' });
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Internal Server Error');
    });
    });

    describe('GET /show', () => {
        it('should return 200 and render the section page', async () => {
        const res = await request(app).get('/show');
        expect(res.statusCode).toEqual(200);
        });
    
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/show/error');
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Internal Server Error');
        });
    });

    describe('GET /all', () => {
    it('should return 200 and render the section page', async () => {
        const res = await request(app).get('/all');
        expect(res.statusCode).toEqual(200);
    });

    it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/all/error');
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Internal Server Error');
    });
    });

    describe('GET /published', () => {
    it('should return 200 and render the section page', async () => {
        const res = await request(app).get('/published');
        expect(res.statusCode).toEqual(200);
    });

    it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/published/error');
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Internal Server Error');
    });
    });
    describe('GET /trash', () => {
        it('should return 200 and render the section page', async () => {
        const res = await request(app).get('/trash');
        expect(res.statusCode).toEqual(200);
        });
    
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/trash/error');
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Internal Server Error');
        });
    });
    
    describe('GET /draft', () => {
        it('should return 200 and render the section page', async () => {
        const res = await request(app).get('/draft');
        expect(res.statusCode).toEqual(200);
        });
    
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get('/draft/error');
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Internal Server Error');
        });
    });
    describe('PUT /update-status/:id', () => {
        it('should return 200 and update the section status', async () => {
        // Assuming that '1' is a valid id
        const res = await request(app).put('/update-status/1').send({ status: 'Published' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ message: 'Section status updated successfully' });
        });
    
        it('should return 404 when the section is not found', async () => {
        // Assuming that 'error' is an invalid id
        const res = await request(app).put('/update-status/error').send({ status: 'Published' });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({ error: 'Section not found' });
        });
    
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).put('/update-status/error').send({ status: 'error' });
        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({ error: 'Internal Server Error' });
        });
    });
    describe('DELETE /delete/:id', () => {
        it('should return 200 and delete the section', async () => {
        // Assuming that '1' is a valid id
        const res = await request(app).delete('/delete/1');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ message: 'Section deleted successfully' });
        });
    
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' is an invalid id
        const res = await request(app).delete('/delete/error');
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Internal Server Error');
        });
    });
    
    describe('GET /edit/:id', () => {
        it('should return 200 and render the edit section page', async () => {
        // Assuming that '1' is a valid id
        const res = await request(app).get('/edit/1');
        expect(res.statusCode).toEqual(200);
        });
    
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' is an invalid id
        const res = await request(app).get('/edit/error');
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Internal Server Error');
        });
    });
    describe('POST /edit/:id', () => {
        it('should return 302 and redirect to the edit section page', async () => {
        // Assuming that '1' is a valid id
        const res = await request(app).post('/edit/1').send({
            title: 'Test Title',
            subHeading: 'Test Subheading',
            imagePosition: 'left',
            content: 'Test Content',
            status: 'Published'
        });
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toEqual('/admin/section/edit/1');
        });
    
        it('should return 500 when an error occurs', async () => {
        // Assuming that 'error' is an invalid id
        const res = await request(app).post('/edit/error').send({
            title: 'Test Title',
            subHeading: 'Test Subheading',
            imagePosition: 'left',
            content: 'Test Content',
            status: 'Published'
        });
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Internal Server Error');
        });
    });
    
    describe('Error handling middleware', () => {
        it('should return 404 and render the not found page', async () => {
        // Assuming that '/error' is an invalid route
        const res = await request(app).get('/error');
        expect(res.statusCode).toEqual(404);
        });
    });

