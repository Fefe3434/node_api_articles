const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");

describe("Articles API", () => {
  let token;
  const USER_ID = "fake_user_id";
  const ADMIN_TOKEN = jwt.sign({ userId: USER_ID, role: "admin" }, config.secretJwtToken);
  const USER_TOKEN = jwt.sign({ userId: USER_ID, role: "member" }, config.secretJwtToken);

  const MOCK_ARTICLE = {
    _id: "fake_article_id",
    title: "Test Title",
    content: "Test Content",
    user: USER_ID,
    status: "draft",
  };

  const MOCK_NEW_ARTICLE = {
    _id: "new_article_id",
    title: "New Article",
    content: "Some content",
    user: USER_ID,
    status: "draft",
  };

  const MOCK_UPDATED_ARTICLE = {
    ...MOCK_ARTICLE,
    title: "Updated Title",
  };

  beforeEach(() => {
    mockingoose(Article).toReturn(MOCK_NEW_ARTICLE, "save");

    mockingoose(Article).toReturn([MOCK_ARTICLE], "find");

    mockingoose(Article).toReturn(MOCK_UPDATED_ARTICLE, "findOneAndUpdate");

    mockingoose(Article).toReturn(MOCK_ARTICLE, "findOneAndDelete");
  });

  test("Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send({ title: "New Article", content: "Some content" })
      .set("x-access-token", USER_TOKEN);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe("New Article");
  });

  test("Update Article as Admin", async () => {
    const res = await request(app)
      .put("/api/articles/fake_article_id")
      .send({ title: "Updated Title" })
      .set("x-access-token", ADMIN_TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Updated Title");
  });

  test("Delete Article as Admin", async () => {
    const res = await request(app)
      .delete("/api/articles/fake_article_id")
      .set("x-access-token", ADMIN_TOKEN);
    expect(res.status).toBe(204);
  });

  test("Get Articles by User", async () => {
    const res = await request(app)
      .get(`/api/articles/users/${USER_ID}/articles`)
      .set("x-access-token", USER_TOKEN);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].user).toBeDefined();
  });
});
