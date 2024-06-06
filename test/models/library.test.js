const mongoose = require('mongoose');
const Image = require('../../models/library');

// Set up the MongoDB URI
process.env.MONGO_URI = 'mongodb://localhost:27017/wordfinder';

describe('Image Model Test', () => {
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

    it('should create & save an image successfully', async () => {
        // Create a new Image instance
        const imageData = {
            src: 'test_image.jpg',
            uploadedBy: 'Test User',
            filename: 'test_image.jpg',
            filetype: 'image/jpeg',
            filesize: '1024',
            dimensions: '800x600',
            alternativeText: 'An example image',
            title: 'Test Image',
            fileUrl: 'http://example.com/test_image.jpg'
        };
        const image = new Image(imageData);

        // Save the image to the database
        const savedImage = await image.save();

        // Assert that the saved image matches the original data
        expect(savedImage._id).toBeDefined();
        expect(savedImage.src).toEqual(imageData.src);
        expect(savedImage.uploadedBy).toEqual(imageData.uploadedBy);
        expect(savedImage.filename).toEqual(imageData.filename);
        expect(savedImage.filetype).toEqual(imageData.filetype);
        expect(savedImage.filesize).toEqual(imageData.filesize);
        expect(savedImage.dimensions).toEqual(imageData.dimensions);
        expect(savedImage.alternativeText).toEqual(imageData.alternativeText);
        expect(savedImage.title).toEqual(imageData.title);
        expect(savedImage.fileUrl).toEqual(imageData.fileUrl);
    });

    it('should fail to create an image without required fields', async () => {
        // Create a new Image instance without specifying required fields
        const imageWithoutRequiredFields = new Image({});
    
        // Attempt to save the image to the database
        let validationError;
        try {
            await imageWithoutRequiredFields.save();
        } catch (error) {
            // If an error occurs, capture it
            validationError = error;
        }
    
        // Assert that a validation error occurred
        expect(validationError).toBeDefined();
        expect(validationError).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(validationError.errors.src).toBeDefined();
        expect(validationError.errors.filename).toBeDefined();
        expect(validationError.errors.filetype).toBeDefined();
        expect(validationError.errors.filesize).toBeDefined();
        expect(validationError.errors.dimensions).toBeDefined();
        expect(validationError.errors.fileUrl).toBeDefined();
    });
});
