const mongoose = require('mongoose');
const UserActivity = require('../../models/user-activity');

// Set up the MongoDB URI
process.env.MONGO_URI = 'mongodb://localhost:27017/your_test_db_name';

describe('UserActivity Model Test', () => {
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
    it('should create & save a user activity successfully', async () => {
        const userActivityData = {
            username: 'testuser',
            ip: '192.168.1.1',
            location: 'New York, USA',
            action: 'Login',
            timestamp: new Date()
        };
        const userActivity = new UserActivity(userActivityData);

        // Save the user activity to the database
        const savedUserActivity = await userActivity.save();

        // Assert that the saved user activity matches the original data
        expect(savedUserActivity._id).toBeDefined();
        expect(savedUserActivity.username).toEqual(userActivityData.username);
        expect(savedUserActivity.ip).toEqual(userActivityData.ip);
        expect(savedUserActivity.location).toEqual(userActivityData.location);
        expect(savedUserActivity.action).toEqual(userActivityData.action);
        expect(savedUserActivity.timestamp.getTime()).toEqual(userActivityData.timestamp.getTime()); // Fix timestamp comparison
    });

    it('should fail to create a user activity without username', async () => {
        const userActivityData = {
            ip: '192.168.1.1',
            location: 'New York, USA',
            action: 'Login',
            timestamp: new Date()
        };
        const userActivity = new UserActivity(userActivityData);

        let validationError;
        try {
            // Attempt to save the user activity to the database
            await userActivity.save();
        } catch (error) {
            // If an error occurs, capture it
            validationError = error;
        }
        // Assert that a validation error occurred
        expect(validationError).toBeDefined();
    });
});
