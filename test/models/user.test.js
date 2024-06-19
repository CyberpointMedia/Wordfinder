const mongoose = require('mongoose');
const User = require('../../models/user');
const bcrypt = require('bcrypt');

// Set up the MongoDB URI
process.env.MONGO_URI = 'mongodb://localhost:27017/your_test_db_name';

describe('User Model Test', () => {
    beforeAll(async () => {
        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        // Drop the database and close the connection after all tests are done
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should create & save a user successfully', async () => {
        const userData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
            website: 'https://example.com',
            role: 'author',
            image: 'https://example.com/image.png',
            sendNotification: true
        };
        const user = new User(userData);

        // Save the user to the database
        const savedUser = await user.save();

        // Assert that the saved user matches the original data
        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toEqual(userData.username);
        expect(savedUser.email).toEqual(userData.email);
        expect(savedUser.website).toEqual(userData.website);
        expect(savedUser.role).toEqual(userData.role);
        expect(savedUser.image).toEqual(userData.image);
        expect(savedUser.sendNotification).toBe(userData.sendNotification);

        // Assert that the password is hashed
        const isPasswordMatch = await bcrypt.compare(userData.password, savedUser.password);
        expect(isPasswordMatch).toBe(true);
    });

    it('should fail to create a user without required fields', async () => {
        const userData = {
            username: 'testuser'
            // Missing email and password
        };
        const user = new User(userData);

        let validationError;
        try {
            // Attempt to save the user to the database
            await user.save();
        } catch (error) {
            // If an error occurs, capture it
            validationError = error;
        }

        // Assert that a validation error occurred
        expect(validationError).toBeDefined();
        expect(validationError).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should hash the password before saving', async () => {
        const userData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        };
        const user = new User(userData);

        // Save the user to the database
        await user.save();

        // Assert that the password is hashed
        const isPasswordMatch = await bcrypt.compare(userData.password, user.password);
        expect(isPasswordMatch).toBe(true);
    });

    it('should not hash the password if it is not modified', async () => {
        const userData = {
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        };
        const user = new User(userData);

        // Save the user to the database
        await user.save();

        // Update the user without changing the password
        user.email = 'newemail@example.com';
        const savedUser = await user.save();

        // Assert that the password remains the same
        const isPasswordMatch = await bcrypt.compare(userData.password, savedUser.password);
        expect(isPasswordMatch).toBe(true);
    });
});
