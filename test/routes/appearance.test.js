//  test/appearance.test.js
 const request = require('supertest');
 const express = require('express');
 const app = express();
 const { ensureAdmin } = require('../../middleware/authMiddleware');
 const Post = require('../../models/post');
 const Page = require('../../models/pages');
 const mongoose = require('mongoose');
const Appearance = require('../../models/appearance');
const router = require('../../routes/appearance');
app.use(express.urlencoded({ extended: false }));
app.use('/', router);

// Mock isAuthenticated method and user object
const mockIsAuthenticated = jest.fn();
const mockUser = { role: '' };

app.use((req, res, next) => {
  req.isAuthenticated = mockIsAuthenticated;
  req.user = mockUser;
  next();
});

// Mock models
 jest.mock('../models/post', () => ({ find: jest.fn() }));
 jest.mock('../models/pages', () => ({ find: jest.fn() }));
 jest.mock('../models/appearance', () => ({ find: jest.fn(), findById: jest.fn() }));

describe('Appearance Route', () => {
  it('GET /nav-menu should fetch nav menu', async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockUser.role = 'admin';

    const mockPosts = [{ _id: '60d6c7e3207ad63f6c8b2775', status: 'Published' }];
     const mockPages = [{ _id: '60d6c7e3207ad63f6c8b2775', status: 'Published' }];
     const mockMenus = [{ _id: '60d6c7e3207ad63f6c8b2775' }];
     const mockSelectedMenu = { _id: '60d6c7e3207ad63f6c8b2775', pages: [], posts: [] };

     Post.find.mockResolvedValue(mockPosts);
    Page.find.mockResolvedValue(mockPages);
     Appearance.find.mockResolvedValue(mockMenus);
    Appearance.findById.mockResolvedValue(mockSelectedMenu);

    const res = await request(app).get('/nav-menu');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('posts');
    expect(res.body).toHaveProperty('pages');
    expect(res.body).toHaveProperty('menus');
    expect(res.body).toHaveProperty('selectedMenuId');
    expect(res.body).toHaveProperty('selectedMenu');
  });

  it('POST /save-menu should save a new menu', async () => {
    const mockMenuName = 'Test Menu';
    const mockPages = ['60d6c7e3207ad63f6c8b2775'];
    const mockPosts = ['60d6c7e3207ad63f6c8b2775'];
    const mockCustomLinks = ['http://example.com'];

     const mockMenu = {
       menuName: mockMenuName,
       pages: mockPages.map(id => new mongoose.Types.ObjectId(id)),
       posts: mockPosts.map(id => new mongoose.Types.ObjectId(id)),
      customLinks: mockCustomLinks,
      _id: new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775'),
      save: jest.fn()
    };

    Appearance.findOne.mockResolvedValue(null);
    Appearance.save.mockResolvedValue(mockMenu);

    const res = await request(app)
      .post('/save-menu')
      .send({
        menuName: mockMenuName,
        pages: mockPages,
        posts: mockPosts,
        customLinks: mockCustomLinks
      });

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual(`/appearance/edit-menu/${mockMenu._id}?message=New Menu created successfully`);
  });

  it('POST /save-menu should not save a new menu if menu name already exists', async () => {
    const mockMenuName = 'Test Menu';
    const mockExistingMenu = { menuName: mockMenuName };

    Appearance.findOne.mockResolvedValue(mockExistingMenu);

    const res = await request(app)
      .post('/save-menu')
      .send({ menuName: mockMenuName });

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/appearance/nav-menu?error=Menu%20name%20already%20exists');
  });

  it('GET /get-menu-details/:menuId should fetch menu details', async () => {
    const mockMenuId = new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775');
    const mockMenu = {
      _id: mockMenuId,
      menuName: 'Test Menu',
      pages: [],
      posts: [],
      customLinks: []
    };

    Appearance.findById.mockResolvedValue(mockMenu);

    const res = await request(app).get(`/get-menu-details/${mockMenuId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('menuName');
    expect(res.body).toHaveProperty('pages');
    expect(res.body).toHaveProperty('posts');
    expect(res.body).toHaveProperty('customLinks');
  });

  it('GET /get-menu-details/:menuId should return 404 if menu not found', async () => {
    const mockMenuId = new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775');

    Appearance.findById.mockResolvedValue(null);

    const res = await request(app).get(`/get-menu-details/${mockMenuId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Menu not found');
  });
  it('GET /edit-menu/:id should fetch menu details for editing', async () => {
    const mockMenuId = new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775');
    const mockMenu = {
      _id: mockMenuId,
      menuName: 'Test Menu',
      pages: [],
      posts: [],
      customLinks: []
    };
    const mockMenus = [mockMenu];
    const mockPages = [{ _id: '60d6c7e3207ad63f6c8b2775', status: 'Published' }];
    const mockPosts = [{ _id: '60d6c7e3207ad63f6c8b2775', status: 'Published' }];

    Appearance.findById.mockResolvedValue(mockMenu);
    Appearance.find.mockResolvedValue(mockMenus);
    Page.find.mockResolvedValue(mockPages);
    Post.find.mockResolvedValue(mockPosts);

    const res = await request(app).get(`/edit-menu/${mockMenuId}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('menu');
    expect(res.body).toHaveProperty('menus');
    expect(res.body).toHaveProperty('pages');
    expect(res.body).toHaveProperty('posts');
    expect(res.body).toHaveProperty('selectedMenuId');
  });
  it('GET /edit-menu/:id should return 404 if menu not found', async () => {
    const mockMenuId = new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775');

    Appearance.findById.mockResolvedValue(null);

    const res = await request(app).get(`/edit-menu/${mockMenuId}`);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('message', 'Menu not found');
  });
it('POST /show-menu should update the ShowMenu document', async () => {
    const mockSelectedMenuId = new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775');
    const mockUpdatedName = ['Updated Name 1', 'Updated Name 2'];
    const mockParent = ['Parent 1', 'Parent 2'];

    const mockAppearance = {
        _id: mockSelectedMenuId,
        menuName: 'Test Menu',
        pages: [{ _id: '60d6c7e3207ad63f6c8b2775' }],
        posts: [{ _id: '60d6c7e3207ad63f6c8b2775' }],
        customLinks: []
    };

    const mockShowMenu = {
        menuName: 'Test Menu',
        items: [
            {
                type: 'page',
                id: '60d6c7e3207ad63f6c8b2775',
                updated_name: 'Updated Name 1',
                parent: 'Parent 1'
            },
            {
                type: 'post',
                id: '60d6c7e3207ad63f6c8b2775',
                updated_name: 'Updated Name 2',
                parent: 'Parent 2'
             }
         ],
         save: jest.fn()
     };

     Appearance.findOne.mockResolvedValue(mockAppearance);
    ShowMenu.findOne.mockResolvedValue(mockShowMenu);

    const res = await request(app)
        .post('/show-menu')
        .send({
            selectedMenuId: mockSelectedMenuId,
            updated_name: mockUpdatedName,
            parent: mockParent
        });

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/appearance/nav-menu');
    expect(mockShowMenu.items[0].updated_name).toEqual('Updated Name 1');
    expect(mockShowMenu.items[0].parent).toEqual('Parent 1');
    expect(mockShowMenu.items[1].updated_name).toEqual('Updated Name 2');
    expect(mockShowMenu.items[1].parent).toEqual('Parent 2');
    expect(mockShowMenu.save).toHaveBeenCalled();
});

it('POST /show-menu should return 404 if Appearance not found', async () => {
    const mockSelectedMenuId = new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775');
    const mockUpdatedName = ['Updated Name 1', 'Updated Name 2'];
    const mockParent = ['Parent 1', 'Parent 2'];

    Appearance.findOne.mockResolvedValue(null);

    const res = await request(app)
        .post('/show-menu')
        .send({
            selectedMenuId: mockSelectedMenuId,
            updated_name: mockUpdatedName,
            parent: mockParent
        });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', 'Appearance not found');
});

it('POST /show-menu should return 400 if invalid updated_name or parent', async () => {
    const mockSelectedMenuId = new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775');
    const mockUpdatedName = 'Updated Name';
    const mockParent = 'Parent';

    const mockAppearance = {
        _id: mockSelectedMenuId,
        menuName: 'Test Menu',
        pages: [{ _id: '60d6c7e3207ad63f6c8b2775' }],
        posts: [{ _id: '60d6c7e3207ad63f6c8b2775' }],
        customLinks: []
    };

    Appearance.findOne.mockResolvedValue(mockAppearance);

    const res = await request(app)
        .post('/show-menu')
        .send({
            selectedMenuId: mockSelectedMenuId,
            updated_name: mockUpdatedName,
            parent: mockParent
        });

    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error', 'Invalid updated_name or parent');
});

it('POST /show-menu should create a new ShowMenu document if it does not exist', async () => {
    const mockSelectedMenuId = new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775');
    const mockUpdatedName = ['Updated Name 1', 'Updated Name 2'];
    const mockParent = ['Parent 1', 'Parent 2'];

    const mockAppearance = {
        _id: mockSelectedMenuId,
        menuName: 'Test Menu',
        pages: [{ _id: '60d6c7e3207ad63f6c8b2775' }],
        posts: [{ _id: '60d6c7e3207ad63f6c8b2775' }],
        customLinks: []
    };

    const mockShowMenu = {
        menuName: 'Test Menu',
        items: [],
        save: jest.fn()
    };

     Appearance.findOne.mockResolvedValue(mockAppearance);
     ShowMenu.findOne.mockResolvedValue(null);
     ShowMenu.mockReturnValue(mockShowMenu);

    const res = await request(app)
        .post('/show-menu')
        .send({
            selectedMenuId: mockSelectedMenuId,
            updated_name: mockUpdatedName,
            parent: mockParent
        });

     expect(res.statusCode).toEqual(302);
     expect(res.headers.location).toEqual('/appearance/nav-menu');
     expect(mockShowMenu.items).toHaveLength(2);
     expect(mockShowMenu.items[0].updated_name).toEqual('Updated Name 1');
     expect(mockShowMenu.items[0].parent).toEqual('Parent 1');
     expect(mockShowMenu.items[1].updated_name).toEqual('Updated Name 2');
     expect(mockShowMenu.items[1].parent).toEqual('Parent 2');
     expect(mockShowMenu.save).toHaveBeenCalled();
 });

it('POST /edit-menu/:id should handle server errors', async () => {
    const mockMenuId = new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775');
    const mockMenuName = 'Updated Menu';
    const mockPages = ['60d6c7e3207ad63f6c8b2775'];
    const mockPosts = ['60d6c7e3207ad63f6c8b2775'];
    const mockCustomLinks = ['http://example.com'];

    const mockError = new Error('Internal Server Error');
    Appearance.findByIdAndUpdate.mockRejectedValue(mockError);

    const res = await request(app)
    .post(`/edit-menu/${mockMenuId}`)
    .send({
      menuName: mockMenuName,
     pages: mockPages,
     posts: mockPosts,
                 customLinks: mockCustomLinks
             });

         expect(res.statusCode).toEqual(500);
         expect(res.body).toHaveProperty('message', 'An error occurred');
     });
     it('DELETE /delete-menu/:id should delete a menu', async () => {
         const mockMenuId = new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775');

         Appearance.findByIdAndDelete.mockResolvedValue(null);

         const res = await request(app).delete(`/delete-menu/${mockMenuId}`);

         expect(res.statusCode).toEqual(200);
         expect(res.body).toHaveProperty('message', 'Menu deleted successfully');
     });

     it('DELETE /delete-menu/:id should return 500 if an error occurs', async () => {
         const mockMenuId = new mongoose.Types.ObjectId('60d6c7e3207ad63f6c8b2775');

         const mockError = new Error('Internal Server Error');
         Appearance.findByIdAndDelete.mockRejectedValue(mockError);

        const res = await request(app).delete(`/delete-menu/${mockMenuId}`);

       expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'An error occurred');
    });
 });

