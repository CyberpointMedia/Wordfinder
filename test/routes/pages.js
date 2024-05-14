 // pages.test.js
 const request = require("supertest");
 const express = require("express");
 const app = express();
 const router = require("../../route/pages");

 app.use(router);

 jest.mock("../../models/section", () => () => ({
   find: jest.fn().mockResolvedValue([]),
 }));

jest.mock("../../models/pages", () => () => ({
  find: jest.fn().mockResolvedValue([]),
  countDocuments: jest.fn().mockResolvedValue(0),
}));

describe("Pages routes", () => {
  it("GET / should return 200 for successful fetch", async () => {
    const res = await request(app).get("/").send();

    expect(res.statusCode).toEqual(200);
  });

   it("GET / should return correct count of documents", async () => {
     const res = await request(app).get("/").send();

     expect(res.body.allCount).toEqual(0);
     expect(res.body.publishedCount).toEqual(0);
     expect(res.body.trashCount).toEqual(0);
     expect(res.body.draftCount).toEqual(0);
   });

   it("GET /create should return 200 for successful fetch", async () => {
     const res = await request(app).get("/create").send();

     expect(res.statusCode).toEqual(200);
   });


   const mockPage = {
     save: jest.fn().mockResolvedValue({ _id: "mockId" }),
  };

   jest.mock("../../models/page", () => () => mockPage);

  it("POST /create should return 302 for successful post", async () => {
    const res = await request(app).post("/create").send({
      page_name: "Test Page",
      page_router: "test-page",
      sections: [],
      sub_heading: "Test Sub Heading",
      content: "Test Content",
      status: "published",
      seoTitle: "Test SEO Title",
      seoMetaDescription: "Test SEO Meta Description",
      searchEngines: "Google",
      "hs-radio-group": "option1",
      metaRobots: "index, follow",
      breadcrumbsTitle: "Test Breadcrumbs Title",
      canonicalURL: "https://example.com/test-page",
      show_search: "true",
    });

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual("/admin/pages/edit/mockId");
  });

   it("should return 400 for duplicate page name", async () => {
     mockPage.findOne.mockResolvedValue({});

     const res = await request(app).post("/create").send({
       page_name: "Test Page",
       page_router: "test-page",
       sections: [],
       sub_heading: "Test Sub Heading",
       content: "Test Content",
       status: "published",
       seoTitle: "Test SEO Title",
       seoMetaDescription: "Test SEO Meta Description",
       searchEngines: "Google",
       "hs-radio-group": "option1",
       metaRobots: "index, follow",
       breadcrumbsTitle: "Test Breadcrumbs Title",
       canonicalURL: "https://example.com/test-page",
       show_search: "true",
     });

     expect(res.statusCode).toEqual(400);
   });

   it("should return 500 for internal server error", async () => {
     mockPage.findOne.mockRejectedValue(new Error("Mock Error"));

     const res = await request(app).post("/create").send({
       page_name: "Test Page",
       page_router: "test-page",
       sections: [],
       sub_heading: "Test Sub Heading",
       content: "Test Content",
         status: "published",
         seoTitle: "Test SEO Title",
         seoMetaDescription: "Test SEO Meta Description",
         searchEngines: "Google",
        "hs-radio-group": "option1",
        metaRobots: "index, follow",
        breadcrumbsTitle: "Test Breadcrumbs Title",
         canonicalURL: "https://example.com/test-page",
         show_search: "true",
       });

     expect(res.statusCode).toEqual(500);
     });
     it("should return 200 and update the status for a valid id", async () => {
         mockPage.findById.mockResolvedValue({
         status: "draft",
         save: jest.fn().mockResolvedValue(true),
        });

         const res = await request(app)
         .put("/update-status/valid-id")
         .send({ status: "published" });

       expect(res.statusCode).toEqual(200);
       expect(res.body).toEqual({ message: "Page status updated successfully" });
       });

    it("should return 404 for an invalid id", async () => {
    mockPage.findById.mockResolvedValue(null);

       const res = await request(app)
    .put("/update-status/invalid-id")
    .send({ status: "published" });

       expect(res.statusCode).toEqual(404);
       expect(res.body).toEqual({ error: "Page not found" });
     });

    it("should return 500 for an internal server error", async () => {
        mockPage.findById.mockRejectedValue(new Error("Mock Error"));

        const res = await request(app)
        .put("/update-status/valid-id")
        .send({ status: "published" });

        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual({ error: "Internal Server Error" });
      });
      it("should return 302 when id is undefined", async () => {
        const res = await request(app).get("/edit/undefined");
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toContain("/admin/pages/create");
      });

    it("should return 302 when page is not found", async () => {
        // Assuming that 'nonexistent-id' does not exist in the database
        const res = await request(app).get("/edit/nonexistent-id");
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toContain("/admin/pages/create");
    });

    it("should return 200 when page is found", async () => {
        // Assuming that 'valid-id' exists in the database
        const res = await request(app).get("/edit/valid-id");
        expect(res.statusCode).toEqual(200);
    });

    it("should return 500 when an error occurs", async () => {
        // Assuming that 'error-id' will cause an error
        const res = await request(app).get("/edit/error-id");
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Internal Server Error");
    });
    it("should return 400 when a page with the same name already exists", async () => {
        const res = await request(app)
        .post("/edit/valid-id")
        .send({ page_name: "Existing Page Name" });
        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual("A page with this name already exists");
    });

    it("should return 200 and update the page when the page name is unique", async () => {
        const res = await request(app)
        .post("/edit/valid-id")
        .send({ page_name: "Unique Page Name" });
        expect(res.statusCode).toEqual(200);
        expect(res.headers.location).toEqual("/admin/pages/edit/valid-id");
    });

    it("should return 500 when an error occurs", async () => {
    const res = await request(app)
       .post("/edit/error-id")
       .send({ page_name: "Any Page Name" });
     expect(res.statusCode).toEqual(500);
     expect(res.text).toEqual("Internal Server Error");
   });
   it("should return 200 and render the published pages", async () => {
     const res = await request(app).get("/published");
     expect(res.statusCode).toEqual(200);
   });

   it("should return 500 when an error occurs", async () => {
     // Assuming that 'error' will cause an error
     const res = await request(app).get("/published/error");
     expect(res.statusCode).toEqual(500);
     expect(res.text).toEqual("Internal Server Error");
   });
   it("should return 200 and render the pages in trash", async () => {
     const res = await request(app).get("/trash");
     expect(res.statusCode).toEqual(200);
   });

   it("should return 500 when an error occurs", async () => {
     // Assuming that 'error' will cause an error
     const res = await request(app).get("/trash/error");
     expect(res.statusCode).toEqual(500);
       expect(res.text).toEqual("Internal Server Error");
     });
     it("should return 200 and restore the page", async () => {
       const res = await request(app).put("/restore/valid-id");
      expect(res.statusCode).toEqual(200);
       expect(res.body.message).toEqual("Page Restore successfully");
     });

   it("should return 500 when an error occurs", async () => {
     const res = await request(app).put("/restore/error-id");
     expect(res.statusCode).toEqual(500);
     expect(res.text).toEqual("Internal Server Error");
    });
    it("should return 200 and delete the page", async () => {
     const res = await request(app).delete("/delete/valid-id");
     expect(res.statusCode).toEqual(200);
     expect(res.body.message).toEqual("Page deleted successfully");
   });

    it("should return 500 when an error occurs", async () => {
        const res = await request(app).delete("/delete/error-id");
        expect(res.statusCode).toEqual(500);
        expect(res.body.message).toEqual("Internal Server Error");
    });
    it("should return 200 and render the draft pages", async () => {
        const res = await request(app).get("/draft");
        expect(res.statusCode).toEqual(200);
    });

    it("should return 500 when an error occurs", async () => {
        // Assuming that 'error' will cause an error
        const res = await request(app).get("/draft/error");
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("Internal Server Error");
    });

    it("should return 404 and render the not found page", async () => {
        // Assuming that 'nonexistent' will cause a 404 error
        const res = await request(app).get("/nonexistent");
        expect(res.statusCode).toEqual(404);
    });
    });
