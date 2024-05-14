// footer.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const router = require('../../routes/footer');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);
// Mock multer middleware for testing
const mockMulter = multer().single('image');
app.use((req, res, next) => {
  req.file = { location: 'someImageUrl' }; // mock image file
  mockMulter(req, res, next);
});
describe('Footer Route', () => {
  it('GET /widgets should return 200', async () => {
    const res = await request(app).get('/widgets');
    expect(res.statusCode).toEqual(200);
  });

  it('POST /addtexteditor should return 302 and redirect', async () => {
    const res = await request(app)
      .post('/addtexteditor')
      .send({ column: 'footerCol1' }); // replace with actual column name

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/footer/widgets?message=Text Editor Widget added successfully');
  });
  it('POST /addcustomhtml should return 302 and redirect', async () => {
    const res = await request(app)
      .post('/addcustomhtml')
      .send({ column: 'footerCol1' }); // replace with actual column name

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/footer/widgets?message=Custom HTML Widget added successfully');
  });

   it('POST /addcontactdetails should return 302 and redirect', async () => {
    const res = await request(app)
      .post('/addcontactdetails')
      .send({ column: 'footerCol1' }); // replace with actual column name

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/footer/widgets?message=Contact Details Widget added successfully');
  });

  it('POST /addimage should return 302 and redirect', async () => {
    const res = await request(app)
      .post('/addimage')
      .send({ column: 'footerCol1' }); // replace with actual column name

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/footer/widgets?message=Image Widget added successfully');
  });

  it('POST /texteditor should return 302 and redirect', async () => {
    const res = await request(app)
      .post('/texteditor')
      .send({ widgetId: 'someWidgetId', texteditor: 'someText' }); // replace with actual widgetId and texteditor content

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/footer/widgets?message=Text Editor Widget added successfully');
  });

  it('POST /Customhtml should return 302 and redirect', async () => {
    const res = await request(app)
      .post('/Customhtml')
      .send({ widgetId: 'someWidgetId', Customhtml: 'someHtml' }); // replace with actual widgetId and Customhtml content

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/footer/widgets?message=Custom HTML Widget added successfully');
  });

  it('POST /contactdetails should return 302 and redirect', async () => {
    const res = await request(app)
      .post('/contactdetails')
      .send({ widgetId: 'someWidgetId', contactdetails: 'someContactDetails' }); // replace with actual widgetId and contactdetails content

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/footer/widgets?message=Contact Details Widget added successfully');
  });

  it('POST /image should return 302 and redirect', async () => {
    const res = await request(app)
      .post('/image')
      .send({ widgetId: 'someWidgetId' }); // replace with actual widgetId

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/footer/widgets?message=Image Widget added successfully');
  });

  it('POST /save-gtm-url should return 302 and redirect', async () => {
    const res = await request(app)
      .post('/save-gtm-url')
      .send({ gtmUrl: 'someGtmUrl' }); // replace with actual gtmUrl

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/footer/widgets?message=GTM URL Widget added successfully');
  });

  it('POST /save-gtm-data should return 302 and redirect', async () => {
    const res = await request(app)
      .post('/save-gtm-data')
      .send({ gtmHead: 'someGtmHead', gtmBody: 'someGtmBody' }); // replace with actual gtmHead and gtmBody

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/footer/widgets?message=GTM data Widget added successfully');
  });

  it('POST /delete/:id should return 302 and redirect', async () => {
    const res = await request(app)
      .post('/delete/someWidgetId') // replace with actual widgetId
      .send();

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('/footer/widgets?message=Widgets delete successfully');
  });
  

});