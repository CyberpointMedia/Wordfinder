const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Category = require('../../models/categories');

describe('Category Model Test', () => {
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
        await Category.deleteMany({});
    });

    // Disconnect from the database after all tests are done.
    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    it('should create & save a category successfully', async () => {
        const categoryData = {
            name: 'Technology',
            slug: 'technology'
        };
        const validCategory = new Category(categoryData);
        const savedCategory = await validCategory.save();

        expect(savedCategory._id).toBeDefined();
        expect(savedCategory.name).toBe(categoryData.name);
        expect(savedCategory.slug).toBe(categoryData.slug);
    });
3
    it('should fail to create a category without required fields', async () => {
        const categoryData = {
            slug: 'technology'
        };
        const invalidCategory = new Category(categoryData);
        let err;
        try {
            await invalidCategory.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.name).toBeDefined();
    });

    it('should add a parent category reference', async () => {
        const parentCategoryData = {
            name: 'Programming',
            slug: 'programming'
        };
        const parentCategory = new Category(parentCategoryData);
        const savedParentCategory = await parentCategory.save();

        const childCategoryData = {
            name: 'JavaScript',
            slug: 'javascript',
            parentCategory: savedParentCategory._id
        };
        const childCategory = new Category(childCategoryData);
        const savedChildCategory = await childCategory.save();

        expect(savedChildCategory._id).toBeDefined();
        expect(savedChildCategory.name).toBe(childCategoryData.name);
        expect(savedChildCategory.slug).toBe(childCategoryData.slug);
        expect(savedChildCategory.parentCategory).toEqual(savedParentCategory._id);
    });
});
