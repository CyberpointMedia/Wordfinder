const mongoose = require('mongoose');
const ShowMenu = require('../../models/show-menu');

// Set up the MongoDB URI
process.env.MONGO_URI = 'mongodb://localhost:27017/wordfinder';

describe('ShowMenu Model Test', () => {
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

    it('should create & save a show menu successfully', async () => {
        // Create a new ShowMenu instance
        const showMenuData = {
            menuName: 'Test Menu',
            items: [
                { type: 'page', id: new mongoose.Types.ObjectId(), updated_name: 'Page 1', parent: null },
                { type: 'post', id: new mongoose.Types.ObjectId(), updated_name: 'Post 1', parent: null },
                { type: 'customLink', id: null, updated_name: 'Custom Link 1', parent: null }
            ]
        };
        const showMenu = new ShowMenu(showMenuData);
    
        // Save the show menu to the database
        const savedShowMenu = await showMenu.save();
    
        // Assert that the saved show menu matches the original data
        expect(savedShowMenu._id).toBeDefined();
        expect(savedShowMenu.menuName).toEqual(showMenuData.menuName);
        expect(savedShowMenu.items.length).toEqual(showMenuData.items.length);
        // Add assertions for other fields if necessary
    });
    

    it('should fail to create a show menu without required fields', async () => {
        // Create a new ShowMenu instance without specifying required fields
        const showMenuWithoutRequiredFields = new ShowMenu({});
        
        let validationError;
        try {
            // Attempt to save the show menu to the database
            await showMenuWithoutRequiredFields.save();
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
