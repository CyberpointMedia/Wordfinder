const mongoose = require('mongoose');
const Page = require('../../models/pages');
const User = require('../../models/user');  // Assuming User model is in the same directory

// Set up the MongoDB URI
process.env.MONGO_URI = 'mongodb://localhost:27017/your_test_db_name';

describe('Page Model Test', () => {
    let user;

    beforeAll(async () => {
        // Connect to the MongoDB database
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Create a test user
        user = new User({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123'
        });
        await user.save();
    });

    afterAll(async () => {
        // Drop the database and close the connection after all tests are done
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    it('should create & save a page successfully', async () => {
        const pageData = {
            page_name: 'Test Page',
            page_router: '/test-page',
            sub_heading: 'Test Sub Heading',
            content: 'This is a test content.',
            show_search: true,
            seoTitle: 'Test SEO Title',
            seoslug: 'test-seo-slug',
            metaDescription: 'Test Meta Description',
            breadcrumbsTitle: 'Test Breadcrumbs Title',
            canonicalURL: 'https://example.com/test-page',
            searchEngines: 2,
            hsRadioGroup: 'Group A',
            metaRobots: 0,
            status: 'Published',
            date: new Date(),
            author: user._id  // Use the test user's ID
        };
        const page = new Page(pageData);

        // Save the page to the database
        const savedPage = await page.save();

        // Assert that the saved page matches the original data
        expect(savedPage._id).toBeDefined();
        expect(savedPage.page_name).toEqual(pageData.page_name);
        expect(savedPage.page_router).toEqual(pageData.page_router);
        expect(savedPage.sub_heading).toEqual(pageData.sub_heading);
        expect(savedPage.content).toEqual(pageData.content);
        expect(savedPage.show_search).toEqual(pageData.show_search);
        expect(savedPage.seoTitle).toEqual(pageData.seoTitle);
        expect(savedPage.seoslug).toEqual(pageData.seoslug);
        expect(savedPage.metaDescription).toEqual(pageData.metaDescription);
        expect(savedPage.breadcrumbsTitle).toEqual(pageData.breadcrumbsTitle);
        expect(savedPage.canonicalURL).toEqual(pageData.canonicalURL);
        expect(savedPage.searchEngines).toEqual(pageData.searchEngines);
        expect(savedPage.hsRadioGroup).toEqual(pageData.hsRadioGroup);
        expect(savedPage.metaRobots).toEqual(pageData.metaRobots);
        expect(savedPage.status).toEqual(pageData.status);
        expect(savedPage.date).toEqual(pageData.date);
        expect(savedPage.author).toEqual(pageData.author);
    });

    it('should fail to create a page without required fields', async () => {
        const pageData = {};  // Empty data, missing required fields

        try {
            // Attempt to save the page to the database
            const page = new Page(pageData);
            await page.save();
        } catch (error) {
            // Assert that a validation error occurred
            expect(error).toBeDefined();
            expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
        }
    });
});
