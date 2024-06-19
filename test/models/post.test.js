const mongoose = require('mongoose');
const Post = require('../../models/post');

// Set up the MongoDB URI
process.env.MONGO_URI = 'mongodb://localhost:27017/wordfinder';

describe('Post Model Test', () => {
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

    it('should create & save a post successfully', async () => {
        // Create a new Post instance
        const postData = {
            title: 'Test Post',
            heading: 'Test Heading',
            description: 'Test Description',
            feature_img: 'test.jpg',
            picture: 'picture.jpg',
            // Add other required fields here if necessary
        };
        const post = new Post(postData);

        // Save the post to the database
        const savedPost = await post.save();

        // Assert that the saved post matches the original data
        expect(savedPost._id).toBeDefined();
        expect(savedPost.title).toEqual(postData.title);
        expect(savedPost.heading).toEqual(postData.heading);
        // Add assertions for other fields if necessary
    });

    it('should fail to create a post without required fields', async () => {
        // Create a new Post instance without specifying required fields
        const postWithoutRequiredFields = new Post({});
        
        let validationError;
        try {
            // Attempt to save the post to the database
            await postWithoutRequiredFields.save();
        } catch (error) {
            // If an error occurs, capture it
            validationError = error;
        }
    
        // Assert that a validation error occurred
        expect(validationError).toBeDefined();
        expect(validationError).toBeInstanceOf(mongoose.Error.ValidationError);
        // Add assertions to check specific validation errors if needed
    });
});
