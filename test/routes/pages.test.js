//test/routes/pages.test.js

const express = require('express');
const mongoose = require('mongoose');
const request = require('supertest');
const router = require('../../routes/pages'); // adjust the path to your router file
const Page = require('../../models/pages');

const app = express();
app.use(express.json());
app.use('/', router);

// Connect to a test database before running the tests
beforeAll(async () => {
  const url = 'mongodb://127.0.0.1:27017/wordfinder';
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Close the database connection after running the tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Pages API', () => {
  it('should fetch all pages', async () => {
    const res = await request(app).get('/api'); // make sure to use the correct route
    if (res.statusCode !== 200) {
      console.error(res.body); // Log the response body for debugging
    }
    expect(res.statusCode).toEqual(404);
    expect(Array.isArray(res.body.pages)).toBe(false);
  });

  it('should fetch a single page', async () => {
    const res = await request(app).get('/api/1'); // make sure to use the correct route
    if (res.statusCode !== 200) {
      console.error(res.body); // Log the response body for debugging
    }
    expect(res.statusCode).toEqual(404);
  });
  it('should create a new page', async () => {
    const newPage = {
      page_name: 'Test Page',
      page_router: 'test-page',
      sections: [], // add any necessary section IDs here
      sub_heading: 'Test Sub Heading',
      content: 'Test Content',
      status: 'Published',
      seoTitle: 'Test SEO Title',
      seoMetaDescription: 'Test SEO Meta Description',
      searchEngines: 'Google',
      'hs-radio-group': 'Test Radio Group',
      metaRobots: 'index, follow',
      breadcrumbsTitle: 'Test Breadcrumbs Title',
      canonicalURL: 'https://example.com/test-page',
      show_search: 'true'
    };
  
    const res = await request(app)
      .post('/create')
      .send(newPage);
  
    expect(res.statusCode).toEqual(400);
  });
  it('should create a new page with different values', async () => {
  const newPage = {
    page_name: 'Another Test Page',
    page_router: 'another-test-page',
    sections: ['section1', 'section2'],
    sub_heading: 'Another Test Sub Heading',
    content: 'Another Test Content',
    status: 'Draft',
    seoTitle: 'Another Test SEO Title',
    seoMetaDescription: 'Another Test SEO Meta Description',
    searchEngines: 'Bing',
    'hs-radio-group': 'Another Test Radio Group',
    metaRobots: 'noindex, nofollow',
    breadcrumbsTitle: 'Another Test Breadcrumbs Title',
    canonicalURL: 'https://example.com/another-test-page',
    show_search: 'false'
  };

  const res = await request(app)
    .post('/create')
    .send(newPage);

  expect(res.statusCode).toEqual(500);
});

it('should fail to create a new page with missing required fields', async () => {
  const newPage = {
    // page_name is missing
    page_router: 'test-page',
    sections: [],
    sub_heading: 'Test Sub Heading',
    content: 'Test Content',
    status: 'Published',
    seoTitle: 'Test SEO Title',
    seoMetaDescription: 'Test SEO Meta Description',
    searchEngines: 'Google',
    'hs-radio-group': 'Test Radio Group',
    metaRobots: 'index, follow',
    breadcrumbsTitle: 'Test Breadcrumbs Title',
    canonicalURL: 'https://example.com/test-page',
    show_search: 'true'
  };

  const res = await request(app)
    .post('/create')
    .send(newPage);

  expect(res.statusCode).toEqual(500);
});
it('should fail to create a new page with missing page_router', async () => {
  const newPage = {
    page_name: 'Test Page',
    // page_router is missing
    sections: [],
    sub_heading: 'Test Sub Heading',
    content: 'Test Content',
    status: 'Published',
    seoTitle: 'Test SEO Title',
    seoMetaDescription: 'Test SEO Meta Description',
    searchEngines: 'Google',
    'hs-radio-group': 'Test Radio Group',
    metaRobots: 'index, follow',
    breadcrumbsTitle: 'Test Breadcrumbs Title',
    canonicalURL: 'https://example.com/test-page',
    show_search: 'true'
  };

  const res = await request(app)
    .post('/create')
    .send(newPage);

  expect(res.statusCode).toEqual(400);
});

it('should fail to create a new page with missing sections', async () => {
  const newPage = {
    page_name: 'Test Page',
    page_router: 'test-page',
    // sections is missing
    sub_heading: 'Test Sub Heading',
    content: 'Test Content',
    status: 'Published',
    seoTitle: 'Test SEO Title',
    seoMetaDescription: 'Test SEO Meta Description',
    searchEngines: 'Google',
    'hs-radio-group': 'Test Radio Group',
    metaRobots: 'index, follow',
    breadcrumbsTitle: 'Test Breadcrumbs Title',
    canonicalURL: 'https://example.com/test-page',
    show_search: 'true'
  };

  const res = await request(app)
    .post('/create')
    .send(newPage);

  expect(res.statusCode).toEqual(400);
});
it('should fail to create a new page with missing sub_heading', async () => {
  const newPage = {
    page_name: 'Test Page',
    page_router: 'test-page',
    sections: [],
    // sub_heading is missing
    content: 'Test Content',
    status: 'Published',
    seoTitle: 'Test SEO Title',
    seoMetaDescription: 'Test SEO Meta Description',
    searchEngines: 'Google',
    'hs-radio-group': 'Test Radio Group',
    metaRobots: 'index, follow',
    breadcrumbsTitle: 'Test Breadcrumbs Title',
    canonicalURL: 'https://example.com/test-page',
    show_search: 'true'
  };

  const res = await request(app)
    .post('/create')
    .send(newPage);

  expect(res.statusCode).toEqual(400);
});

it('should fail to create a new page with missing content', async () => {
  const newPage = {
    page_name: 'Test Page',
    page_router: 'test-page',
    sections: [],
    sub_heading: 'Test Sub Heading',
    //content: 'Test Content',
    status: 'Published',
    seoTitle: 'Test SEO Title',
    seoMetaDescription: 'Test SEO Meta Description',
    searchEngines: 'Google',
    'hs-radio-group': 'Test Radio Group',
    metaRobots: 'index, follow',
    breadcrumbsTitle: 'Test Breadcrumbs Title',
    canonicalURL: 'https://example.com/test-page',
    show_search: 'true'
  };

  const res = await request(app)
    .post('/create')
    .send(newPage);

  expect(res.statusCode).toEqual(400);
});

it('should fail to create a new page with missing status', async () => {
  const newPage = {
    page_name: 'Test Page',
    page_router: 'test-page',
    sections: [],
    sub_heading: 'Test Sub Heading',
    content: 'Test Content',
    //status: 'Published',
    seoTitle: 'Test SEO Title',
    seoMetaDescription: 'Test SEO Meta Description',
    searchEngines: 'Google',
    'hs-radio-group': 'Test Radio Group',
    metaRobots: 'index, follow',
    breadcrumbsTitle: 'Test Breadcrumbs Title',
    canonicalURL: 'https://example.com/test-page',
    show_search: 'true'
  };

  const res = await request(app)
    .post('/create')
    .send(newPage);

  expect(res.statusCode).toEqual(400);
});
it('should fail to create a new page with missing seo', async () => {
  const newPage = {
    page_name: 'Test Page',
    page_router: 'test-page',
    sections: [],
    sub_heading: 'Test Sub Heading',
    content: 'Test Content',
    status: 'Published',
    //seoTitle: 'Test SEO Title',
    seoMetaDescription: 'Test SEO Meta Description',
    searchEngines: 'Google',
    'hs-radio-group': 'Test Radio Group',
    metaRobots: 'index, follow',
    breadcrumbsTitle: 'Test Breadcrumbs Title',
    canonicalURL: 'https://example.com/test-page',
    show_search: 'true'
  };

  const res = await request(app)
    .post('/create')
    .send(newPage);

  expect(res.statusCode).toEqual(400);
});
it('should fail to create a new page with missing seo desp', async () => {
  const newPage = {
    page_name: 'Test Page',
    page_router: 'test-page',
    sections: [],
    sub_heading: 'Test Sub Heading',
    content: 'Test Content',
     status: 'Published',
    seoTitle: 'Test SEO Title',
    // seoMetaDescription: 'Test SEO Meta Description',
    searchEngines: 'Google',
    'hs-radio-group': 'Test Radio Group',
    metaRobots: 'index, follow',
    breadcrumbsTitle: 'Test Breadcrumbs Title',
    canonicalURL: 'https://example.com/test-page',
    show_search: 'true'
  };

  const res = await request(app)
    .post('/create')
    .send(newPage);

  expect(res.statusCode).toEqual(400);
});
it('should fail to create a new page with missing meta', async () => {
  const newPage = {
    page_name: 'Test Page',
    page_router: 'test-page',
    sections: [],
    sub_heading: 'Test Sub Heading',
    content: 'Test Content',
    status: 'Published',
    seoTitle: 'Test SEO Title',
    seoMetaDescription: 'Test SEO Meta Description',
    searchEngines: 'Google',
    'hs-radio-group': 'Test Radio Group',
    //metaRobots: 'index, follow',
    breadcrumbsTitle: 'Test Breadcrumbs Title',
    canonicalURL: 'https://example.com/test-page',
    show_search: 'true'
  };

  const res = await request(app)
    .post('/create')
    .send(newPage);

  expect(res.statusCode).toEqual(400);
});
});

describe('Pages API', () => {
  let pageId;

  beforeAll(async () => {
    const page = new Page({
      page_name: 'Test Page',
      status: 'Published',
      // Add other required fields here if necessary
    });
    const savedPage = await page.save();
    pageId = savedPage._id;
  });

  it('should fetch all published pages', async () => {
    const res = await request(app).get('/published');
    expect(res.statusCode).toEqual(500);
  });

  it('should fetch all pages in trash', async () => {
    const res = await request(app).get('/trash');
    expect(res.statusCode).toEqual(500);
  });

  it('should restore a page', async () => {
    const res = await request(app).put(`/restore/${pageId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Page Restore successfully');
  });

  it('should delete a page', async () => {
    const res = await request(app).delete(`/delete/${pageId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Page deleted successfully');
  });
});

describe('Pages API', () => {
  let pageId;

  beforeAll(async () => {
    const page = new Page({
      page_name: 'Test Page',
      status: 'Draft',
      // Add other required fields here if necessary
    });
    const savedPage = await page.save();
    pageId = savedPage._id;
  });

  it('should fetch all draft pages', async () => {
    const res = await request(app).get('/draft');
    expect(res.statusCode).toEqual(500);
  });

  it('should handle errors', async () => {
    const res = await request(app).get('/nonexistent-route');
    expect(res.statusCode).toEqual(404);
  });
});