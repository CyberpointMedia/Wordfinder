const mongoose = require('mongoose');
const Section = require('../../models/section');

// Set up the MongoDB URI
process.env.MONGO_URI = 'mongodb://localhost:27017/wordfinder';

describe('Section Model Test', () => {
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

    it('should create & save a section successfully', async () => {
        // Create a new Section instance
        const sectionData = {
            title: 'Test Section',
            subHeading: 'Test Subheading',
            content: 'Test Content',
            image: 'test.jpg',
            imagePosition: 'center',
            status: 'Published'
            // Add other required fields here if necessary
        };
        const section = new Section(sectionData);

        // Save the section to the database
        const savedSection = await section.save();

        // Assert that the saved section matches the original data
        expect(savedSection._id).toBeDefined();
        expect(savedSection.title).toEqual(sectionData.title);
        expect(savedSection.subHeading).toEqual(sectionData.subHeading);
        // Add assertions for other fields if necessary
    });

    it('should fail to create a section without required fields', async () => {
        // Create a new Section instance without specifying required fields
        const sectionWithoutRequiredFields = new Section({});
        
        let validationError;
        try {
            // Attempt to save the section to the database
            await sectionWithoutRequiredFields.save();
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
