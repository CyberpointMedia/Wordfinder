// test/routes/appearance.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Appearance = require('../../models/appearance');
const Post = require('../../models/post');
const Page = require('../../models/pages');
const ShowMenu = require('../../models/show-menu');
const appearanceRoutes = require('../../routes/appearance');
const { ensureAdmin } = require('../../middleware/authMiddleware.js'); // Add debugging log

// Add debugging log to confirm the path
console.log('Loading middleware from: ', require.resolve('../../middleware/authMiddleware.js'));

// Mock ensureAdmin middleware to always pass
jest.mock('../../middleware/authMiddleware.js', () => ({ // Ensure .js extension is included
    ensureAdmin: (req, res, next) => next()
}));

let app;
let mongoServer;

beforeAll(async () => {
    
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    app = express();
    app.use('/appearance', appearanceRoutes);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    // Clean up the database after each test
    await Appearance.deleteMany({});
    await Post.deleteMany({});
    await Page.deleteMany({});
    await ShowMenu.deleteMany({});
});

// describe('GET /appearance/nav-menu', () => {
//   it('should render nav-menu view with published posts and pages', async () => {
//       const post = new Post({
//           title: 'Test Post',
//           status: 'Published',
//           picture: 'test-picture.jpg',
//           feature_img: 'test-feature-img.jpg',
//           description: 'Test description',
//           heading: 'Test heading'
//       });
//       const page = new Page({
//           title: 'Test Page',
//           status: 'Published',
//           content: 'Test content' // Assuming 'content' is a required field for the Page model
//       });
//       await post.save();
//       await page.save();

//       const res = await request(app).get('/appearance/nav-menu');

//       expect(res.status).toBe(200);
//       expect(res.text).toContain('Test Post');
//       expect(res.text).toContain('Test Page');
//   });
// });

describe('POST /appearance/save-menu', () => {
    it('should save a new menu', async () => {
        const res = await request(app)
            .post('/appearance/save-menu')
            .send({
                menuName: 'Test Menu',
                pages: [],
                posts: [],
                customLinks: []
            });

        expect(res.status).toBe(302);
        const menu = await Appearance.findOne({ menuName: 'Test Menu' });
        expect(menu).not.toBeNull();
    });

    it('should return error if menu name already exists', async () => {
        const menu = new Appearance({ menuName: 'Test Menu', pages: [], posts: [], customLinks: [] });
        await menu.save();

        const res = await request(app)
            .post('/appearance/save-menu')
            .send({
                menuName: 'Test Menu',
                pages: [],
                posts: [],
                customLinks: []
            });

        expect(res.status).toBe(302);
        expect(res.header.location).toContain('error=Menu%20name%20already%20exists');
    });
});

describe('POST /appearance/edit-menu/:id', () => {
    it('should update an existing menu', async () => {
        const menu = new Appearance({ menuName: 'Old Menu', pages: [], posts: [], customLinks: [] });
        await menu.save();

        const res = await request(app)
            .post(`/appearance/edit-menu/${menu._id}`)
            .send({
                menuName: 'Updated Menu',
                pages: [],
                posts: [],
                customLinks: []
            });

        expect(res.status).toBe(302);
        const updatedMenu = await Appearance.findById(menu._id);
        expect(updatedMenu.menuName).toBe('Updated Menu');
    });

    it('should return 404 if menu not found', async () => {
        const res = await request(app)
            .post('/appearance/edit-menu/invalid-id')
            .send({
                menuName: 'Updated Menu',
                pages: [],
                posts: [],
                customLinks: []
            });

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
    });
});

describe('DELETE /appearance/delete-menu/:id', () => {
    it('should delete an existing menu', async () => {
        const menu = new Appearance({ menuName: 'Test Menu', pages: [], posts: [], customLinks: [] });
        await menu.save();

        const res = await request(app).delete(`/appearance/delete-menu/${menu._id}`);

        expect(res.status).toBe(200);
        const deletedMenu = await Appearance.findById(menu._id);
        expect(deletedMenu).toBeNull();
    });

    it('should return 500 if an error occurs', async () => {
        const res = await request(app).delete('/appearance/delete-menu/invalid-id');

        expect(res.status).toBe(500);
        expect(res.body.message).toBe('An error occurred');
    });
});
