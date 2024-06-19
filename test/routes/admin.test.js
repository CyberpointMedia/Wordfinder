// test/admin.test.js

const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const User = require('../../models/user');
const Post = require('../../models/post');
const Page = require('../../models/pages');
const Visit = require('../../models/visitcount');
const UserActivity = require('../../models/user-activity');
const adminRoutes = require('../../routes/admin');

// Mock the middleware
jest.mock('../../middleware/authMiddleware', () => {
    const mongoose = require('mongoose');
    return {
        ensureAdmin: jest.fn((req, res, next) => {
            req.user = { role: 'administrator', _id: new mongoose.Types.ObjectId() }; // Mock authenticated admin user
            next();
        }),
        ensureEditor: jest.fn((req, res, next) => {
            req.user = { role: 'editor', _id: new mongoose.Types.ObjectId() }; // Mock authenticated editor user
            next();
        }),
        ensureAuthor: jest.fn((req, res, next) => {
            req.user = { role: 'author', _id: new mongoose.Types.ObjectId() }; // Mock authenticated author user
            next();
        }),
    };
});

const app = express();

// Set the view engine (if you're using one)
app.set('views', path.join(__dirname, '../../views'));
app.set('view engine', 'ejs');

// Middleware for parsing JSON bodies
app.use(express.json());
app.use('/admin', adminRoutes);

beforeAll(async () => {
    const url = 'mongodb://127.0.0.1:27017/testDB'; // Replace with your test DB URL
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('Admin Routes', () => {
    let adminToken;

    beforeEach(async () => {
        await User.deleteMany({});
        await Post.deleteMany({});
        await Page.deleteMany({});
        await Visit.deleteMany({});
        await UserActivity.deleteMany({});

        const adminUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: 'password',
            role: 'administrator',
        });

        await adminUser.save();
    });

    it('should create a new user profile', async () => {
        const res = await request(app)
            .post('/admin/create-profile')
            .send({
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password',
                website: 'http://example.com',
                role: 'author',
                sendNotification: 'on',
            })
            .expect(302);

        const user = await User.findOne({ email: 'testuser@example.com' });
        expect(user).not.toBeNull();
        expect(user.username).toBe('testuser');
    });

    it('should render the edit profile page', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'author',
        });
        await user.save();

        const res = await request(app)
            .get(`/admin/edit-profile/${user._id}`)
            .expect(200);

        expect(res.text).toContain('Edit Profile');
    });

    it('should update a user profile', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'author',
        });
        await user.save();

        const res = await request(app)
            .post(`/admin/edit-profile/${user._id}`)
            .send({
                username: 'updateduser',
                email: 'updateduser@example.com',
                role: 'editor',
            })
            .expect(302);

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.username).toBe('updateduser');
        expect(updatedUser.email).toBe('updateduser@example.com');
        expect(updatedUser.role).toBe('editor');
    });

    it('should delete a user profile', async () => {
        const user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password',
            role: 'author',
        });
        await user.save();

        const res = await request(app)
            .get(`/admin/delete-profile/${user._id}`)
            .expect(302);

        const deletedUser = await User.findById(user._id);
        expect(deletedUser).toBeNull();
    });

  //   it('should render the dashboard', async () => {
  //     const res = await request(app)
  //         .get('/admin/dashboard')
  //         .expect(200); // Ensure the dashboard renders successfully
  //     expect(res.text).toContain('Dashboard');
  // });

    it('should render all users page', async () => {
        const res = await request(app)
            .get('/admin/all-users')
            .expect(200);

        expect(res.text).toContain('All Users');
    });
});
