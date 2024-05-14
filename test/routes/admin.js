// test/admin.test.js

const request = require("supertest");
const express = require("express");
const app = express();
const { ensureAdmin } = require("../middleware/authMiddleware");
const User = require("../../models/user");
const router = require("../../routes/admin");
app.use(express.urlencoded({ extended: false }));
app.use("/", router);

// Mock isAuthenticated method and user object
const mockIsAuthenticated = jest.fn();
const mockUser = { role: "" };

app.use((req, res, next) => {
  req.isAuthenticated = mockIsAuthenticated;
  req.user = mockUser;
  next();
});
// Mock User model
jest.mock("../../models/user", () => ({
  findOne: jest.fn(),
  countDocuments: jest.fn(),
  find: jest.fn(),
}));


describe("Admin Registration Route", () => {
  it("should allow admin to register", async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockUser.role = "admin";

    const res = await request(app).get("/register");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("Admin Registration");
  });

  it("should not allow non-admin to register", async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockUser.role = "user";

    const res = await request(app).get("/register");
    expect(res.statusCode).toEqual(403);
    expect(res.text).toEqual("Forbidden");
  });

  it("should not allow unauthenticated access", async () => {
    mockIsAuthenticated.mockReturnValue(false);

    const res = await request(app).get("/register");
    expect(res.statusCode).toEqual(403);
    expect(res.text).toEqual("Forbidden");
  });
});

describe("Create Profile Route", () => {
  it("should create a new user profile", async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockUser.role = "admin";
    User.findOne.mockResolvedValue(null);

    const newUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "author",
      sendNotification: "on",
    };

    const res = await request(app).post("/create-profile").send(newUser);
    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual(
      "/admin/all-users?message=User%20profile%20created%20successfully"
    );
  });

  it("should not create a new user profile if email already exists", async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockUser.role = "admin";
    User.findOne.mockResolvedValue({ email: "testuser@example.com" });

    const newUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "author",
      sendNotification: "on",
    };

    const res = await request(app).post("/create-profile").send(newUser);

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual(
      "/admin/register?message=User%20with%20this%20email%20already%20exists"
    );
  });

  it("should not create a new user profile if not authenticated", async () => {
    mockIsAuthenticated.mockReturnValue(false);

    const newUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "author",
      sendNotification: "on",
    };

    const res = await request(app).post("/create-profile").send(newUser);

    expect(res.statusCode).toEqual(403);
  });

  it("should not create a new user profile if not admin", async () => {
    mockIsAuthenticated.mockReturnValue(true);
    mockUser.role = "user";

    const newUser = {
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "author",
      sendNotification: "on",
    };

    const res = await request(app).post("/create-profile").send(newUser);

    expect(res.statusCode).toEqual(403);
  });
});
describe("GET /edit-profile/:id", () => {
  it("should fetch a user profile for editing", async () => {
    const mockUser = {
      _id: "60d6c7e3207ad63f6c8b2775",
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "author",
      sendNotification: true,
    };

    User.findById.mockResolvedValue(mockUser);

    const res = await request(app).get(`/edit-profile/${mockUser._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockUser);
  });

  it("should return 500 if an error occurs", async () => {
    User.findById.mockRejectedValue(new Error("An error occurred"));

    const res = await request(app).get(
      "/edit-profile/60d6c7e3207ad63f6c8b2775"
    );

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("An error occurred");
  });
});
describe("POST /edit-profile/:id", () => {
  it("should update a user profile", async () => {
    const mockUser = {
      _id: "60d6c7e3207ad63f6c8b2775",
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "author",
      sendNotification: true,
    };

    User.findByIdAndUpdate.mockResolvedValue(mockUser);

    const res = await request(app)
      .post(`/edit-profile/${mockUser._id}`)
      .send(mockUser);

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual(
      "/admin/all-users?message=User%20profile%20updated%20successfully"
    );
  });

  it("should return 500 if an error occurs", async () => {
    User.findByIdAndUpdate.mockRejectedValue(new Error("An error occurred"));
    const res = await request(app)
      .post("/edit-profile/60d6c7e3207ad63f6c8b2775")
      .send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password",
        website: "https://example.com",
        role: "author",
        sendNotification: "on",
      });

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("An error occurred");
  });
});

describe("GET /delete-profile/:id", () => {
  it("should delete a user profile", async () => {
    const mockUser = {
      _id: "60d6c7e3207ad63f6c8b2775",
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "author",
      sendNotification: true,
    };

    User.findByIdAndDelete.mockResolvedValue(mockUser);

    const res = await request(app).get(`/delete-profile/${mockUser._id}`);

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual(
      "/admin/all-users?message=User%20profile%20deleted%20successfully"
    );
  });

  it("should return 500 if an error occurs", async () => {
    User.findByIdAndDelete.mockRejectedValue(new Error("An error occurred"));

    const res = await request(app).get(
      "/delete-profile/60d6c7e3207ad63f6c8b2775"
    );

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("An error occurred");
  });
});

describe("GET /dashboard", () => {
  it("should fetch dashboard data", async () => {
    const mockUser = {
      _id: "60d6c7e3207ad63f6c8b2775",
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "author",
      sendNotification: true,
    };

    User.find.mockResolvedValue([mockUser]);
    Post.countDocuments.mockResolvedValue(10);
    Page.countDocuments.mockResolvedValue(5);
    UserActivity.find.mockResolvedValue([]);
    Visit.findOne.mockResolvedValue({ visitCount: 100 });
    Post.find.mockResolvedValue([]);

    const res = await request(app).get("/dashboard");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body).toHaveProperty("totalPosts");
    expect(res.body).toHaveProperty("totalPages");
    expect(res.body).toHaveProperty("userActivities");
    expect(res.body).toHaveProperty("visitCount");
    expect(res.body).toHaveProperty("unscrambleVisitCount");
    expect(res.body).toHaveProperty("averageReadingTime");
  });

  it("should return 500 if an error occurs", async () => {
    User.find.mockRejectedValue(new Error("An error occurred"));

    const res = await request(app).get("/dashboard");

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("An error occurred");
  });
});

describe("GET /all-users", () => {
  it("should fetch all users and their roles count", async () => {
    const mockUser = {
      _id: "60d6c7e3207ad63f6c8b2775",
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "author",
      sendNotification: true,
    };

    User.find.mockResolvedValue([mockUser]);
    User.countDocuments.mockResolvedValue(1);

    const res = await request(app).get("/all-users");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body).toHaveProperty("totalCount");
  });

  it("should return 500 if an error occurs", async () => {
    User.find.mockRejectedValue(new Error("An error occurred"));

    const res = await request(app).get("/all-users");

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("An error occurred");
  });
});

describe("GET /all-users/subscriber", () => {
  it("should fetch all subscribers and their roles count", async () => {
    const mockUser = {
      _id: "60d6c7e3207ad63f6c8b2775",
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "subscriber",
      sendNotification: true,
    };

    User.find.mockResolvedValue([mockUser]);
    User.countDocuments.mockResolvedValue(1);

    const res = await request(app).get("/all-users/subscriber");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body).toHaveProperty("totalCount");
  });

  it("should return 500 if an error occurs", async () => {
    User.find.mockRejectedValue(new Error("An error occurred"));

    const res = await request(app).get("/all-users/subscriber");

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("An error occurred");
  });
});

describe("GET /all-users/editor", () => {
  it("should fetch all editors and their roles count", async () => {
    const mockUser = {
      _id: "60d6c7e3207ad63f6c8b2775",
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "editor",
      sendNotification: true,
    };

    User.find.mockResolvedValue([mockUser]);
    User.countDocuments.mockResolvedValue(1);

    const res = await request(app).get("/all-users/editor");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body).toHaveProperty("totalCount");
  });

  it("should return 500 if an error occurs", async () => {
    User.find.mockRejectedValue(new Error("An error occurred"));

    const res = await request(app).get("/all-users/editor");

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("An error occurred");
  });
});

describe("GET /all-users/administrator", () => {
  it("should fetch all administrators and their roles count", async () => {
    const mockUser = {
      _id: "60d6c7e3207ad63f6c8b2775",
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "administrator",
      sendNotification: true,
    };

    User.find.mockResolvedValue([mockUser]);
    User.countDocuments.mockResolvedValue(1);

    const res = await request(app).get("/all-users/administrator");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body).toHaveProperty("totalCount");
  });

  it("should return 500 if an error occurs", async () => {
    User.find.mockRejectedValue(new Error("An error occurred"));

    const res = await request(app).get("/all-users/administrator");

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("An error occurred");
  });
});
describe("GET /all-users/author", () => {
  it("should fetch all authors and their roles count", async () => {
    const mockUser = {
      _id: "60d6c7e3207ad63f6c8b2775",
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "author",
      sendNotification: true,
    };

    User.find.mockResolvedValue([mockUser]);
    User.countDocuments.mockResolvedValue(1);

    const res = await request(app).get("/all-users/author");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body).toHaveProperty("totalCount");
  });

  it("should return 500 if an error occurs", async () => {
    User.find.mockRejectedValue(new Error("An error occurred"));

    const res = await request(app).get("/all-users/author");

    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual("An error occurred");
  });
});

describe("Admin routes", () => {
  it("GET /all-users/editor should fetch all editors", async () => {
    const mockUser = {
      _id: "60d6c7e3207ad63f6c8b2775",
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "editor",
      sendNotification: true,
    };

    User.find.mockResolvedValue([mockUser]);

    const res = await request(app).get("/all-users/editor");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("users");
  });
  it("GET /all-users/administrator should fetch all administrators", async () => {
    const mockUser = {
      _id: "60d6c7e3207ad63f6c8b2775",
      username: "testuser",
      email: "testuser@example.com",
      password: "password",
      website: "https://example.com",
      role: "administrator",
      sendNotification: true,
    };

    User.find.mockResolvedValue([mockUser]);

    const res = await request(app).get("/all-users/administrator");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("users");
  });

  it("GET /logout should log the admin out", async () => {
    const res = await request(app).get("/logout");

    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual("/admin/login");
  });

  it("should handle errors", async () => {
    const res = await request(app).get("/nonexistent-route");

    expect(res.statusCode).toEqual(404);
  });
});
