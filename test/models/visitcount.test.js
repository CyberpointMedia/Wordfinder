const mongoose = require('mongoose');
const Visit = require('../../models/visitcount');

// Set up the MongoDB URI
process.env.MONGO_URI = 'mongodb://localhost:27017/your_test_db_name';

describe('Visit Model Test', () => {
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

    it('should create & save a visit successfully', async () => {
        const visitData = {
            path: '/test-path',
            visitCount: 5
        };
        const visit = new Visit(visitData);

        // Save the visit to the database
        const savedVisit = await visit.save();

        // Assert that the saved visit matches the original data
        expect(savedVisit._id).toBeDefined();
        expect(savedVisit.path).toEqual(visitData.path);
        expect(savedVisit.visitCount).toEqual(visitData.visitCount);
    });

    it('should have a default visitCount of 0 if not provided', async () => {
        const visitData = {
            path: '/test-path'
        };
        const visit = new Visit(visitData);

        // Save the visit to the database
        const savedVisit = await visit.save();

        // Assert that the visitCount is 0 by default
        expect(savedVisit.visitCount).toBe(0);
    });

    it('should fail to create a visit without a path', async () => {
        const visitData = {
            visitCount: 5
        };
        const visit = new Visit(visitData);

        let validationError;
        try {
            // Attempt to save the visit to the database
            await visit.save();
        } catch (error) {
            // If an error occurs, capture it
            validationError = error;
        }

        // Assert that a validation error occurred
        expect(validationError).toBeDefined();
        expect(validationError).toBeInstanceOf(mongoose.Error.ValidationError);
    });

    it('should increment visitCount correctly', async () => {
        const visitData = {
            path: '/test-path',
            visitCount: 1
        };
        const visit = new Visit(visitData);

        // Save the visit to the database
        await visit.save();

        // Increment the visitCount
        visit.visitCount += 1;
        const updatedVisit = await visit.save();

        // Assert that the visitCount is incremented correctly
        expect(updatedVisit.visitCount).toBe(2);
    });
});
