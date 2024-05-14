   // test/auth.test.js
    const request = require('supertest');
    const express = require('express');
    const app = express();
    const router = require('../../routes/auth');

    app.use(express.urlencoded({ extended: false }));
    app.use('/', router);

    describe('Auth Route', () => {
        it('GET /register should render register page for non-admin users', async () => {
        const mockSession = { isAdmin: false };
        app.use((req, res, next) => {
            req.session = mockSession;
            next();
        });

        const res = await request(app).get('/register');

        expect(res.statusCode).toEqual(200);
            // Add more assertions based on what you expect to be in the response
        });

        it('GET /register should redirect admin users to /admin/register', async () => {
        const mockSession = { isAdmin: true };
        app.use((req, res, next) => {
            req.session = mockSession;
            next();
        });

       const res = await request(app).get('/register');

       expect(res.statusCode).toEqual(302);
       expect(res.headers.location).toEqual('/admin/register');
     });    

        it('POST /register should redirect to /login', async () => {
            const res = await request(app).post('/register');
        
            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toEqual('/login');
        });

        it('GET /login should render login page with error message', async () => {
            const errorMessage = 'Invalid credentials';
            const res = await request(app).get('/login?error=' + errorMessage);

            expect(res.statusCode).toEqual(200);
            expect(res.text).toContain(errorMessage);
        });
        it('POST /login should redirect to /admin/dashboard on successful login', async () => {
            const res = await request(app).post('/login');

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toEqual('/admin/dashboard');
        });

        it('POST /login should redirect to /auth/login with error message on invalid credentials', async () => {
            const errorMessage = 'Wrong email or password';
            const res = await request(app).post('/login');

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toEqual('/auth/login?error=Wrong%20email%20or%20password');
        });

        it('GET /logout should redirect to home page after logout', async () => {
            const res = await request(app).get('/logout');

            expect(res.statusCode).toEqual(302);
            expect(res.headers.location).toEqual('/');
        });
    });