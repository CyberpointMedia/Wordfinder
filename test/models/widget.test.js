const mongoose = require('mongoose');
const Widget = require('../../models/widget');

// Set up the MongoDB URI
process.env.MONGO_URI = 'mongodb://localhost:27017/wordfinder';

describe('Widget Model Test', () => {
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

    it('should create & save a widget successfully', async () => {
        // Create a new Widget instance
        const widgetData = {
            name: 'Test Widget',
            texteditor: '<p>This is a test widget.</p>',
            Customhtml: '<div>This is custom HTML for the widget.</div>',
            contactdetails: 'Contact information for the widget',
            image: 'test.jpg',
            column: 'left',
            gtmUrl: 'https://www.example.com',
            gtmHead: '<script>...</script>',
            gtmBody: '<script>...</script>'
        };
        const widget = new Widget(widgetData);

        // Save the widget to the database
        const savedWidget = await widget.save();

        // Assert that the saved widget matches the original data
        expect(savedWidget._id).toBeDefined();
        expect(savedWidget.name).toEqual(widgetData.name);
        // Add more assertions for other properties if needed
    });

    it('should fail to create a widget with invalid data', async () => {
        // Create a new Widget instance with invalid data
        const widgetWithInvalidData = new Widget({
            name: {},  // Invalid type for name
            texteditor: '<p>This is a test widget.</p>',
            Customhtml: '<div>This is custom HTML for the widget.</div>',
            contactdetails: 'Contact information for the widget',
            image: 'test.jpg',
            column: 'left',
            gtmUrl: 'https://www.example.com',
            gtmHead: '<script>...</script>',
            gtmBody: '<script>...</script>'
        });

        // Attempt to save the widget to the database
        let validationError;
        try {
            await widgetWithInvalidData.save();
        } catch (error) {
            // If an error occurs, capture it
            validationError = error;
        }

        // Assert that a validation error occurred
        expect(validationError).toBeDefined();
        expect(validationError).toBeInstanceOf(mongoose.Error.ValidationError);
        // Add assertions to check specific validation errors if needed
        expect(validationError.errors.name).toBeDefined();
    });
});
