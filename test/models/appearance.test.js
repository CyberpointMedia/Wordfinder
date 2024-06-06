const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Appearance = require('../../models/appearance');

describe('Appearance Model Test', () => {
    let mongoServer;

    // Connect to the in-memory database before running any tests.
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    // Clear the database after each test.
    afterEach(async () => {
        await Appearance.deleteMany({});
    });

    // Disconnect from the database after all tests are done.
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    it('should create & save an appearance successfully', async () => {
        const appearanceData = {
            menuName: 'Main Menu',
            customLinks: [{ url: 'http://example.com', text: 'Example' }]
        };
        const validAppearance = new Appearance(appearanceData);
        const savedAppearance = await validAppearance.save();

        expect(savedAppearance._id).toBeDefined();
        expect(savedAppearance.menuName).toBe(appearanceData.menuName);
        expect(savedAppearance.customLinks).toMatchObject(appearanceData.customLinks);
    });

    it('should fail to create an appearance without required fields', async () => {
        const appearanceData = {
            customLinks: [{ url: 'http://example.com', text: 'Example' }]
        };
        const invalidAppearance = new Appearance(appearanceData);
        let err;
        try {
            await invalidAppearance.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.menuName).toBeDefined();
    });

    it('should add pages and posts as references', async () => {
        const pageId = new mongoose.Types.ObjectId();
        const postId = new mongoose.Types.ObjectId();

        const appearanceData = {
            menuName: 'Main Menu',
            pages: [pageId],
            posts: [postId],
            customLinks: [{ url: 'http://example.com', text: 'Example' }]
        };
        const validAppearance = new Appearance(appearanceData);
        const savedAppearance = await validAppearance.save();

        expect(savedAppearance._id).toBeDefined();
        expect(savedAppearance.pages[0]).toEqual(pageId);
        expect(savedAppearance.posts[0]).toEqual(postId);
    });
});
