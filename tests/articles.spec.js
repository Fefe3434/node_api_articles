const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.schema");
const articleService = require("../api/articles/articles.service");

describe("Article API tests", () => {
  let token;
  const USER_ID = "fakeUserId";
  const ARTICLE_ID = "fakeArticleId";
  const MOCK_ARTICLES = [
    {
      _id: ARTICLE_ID,
      title: "Sample Article",
      content: "This is a sample article.",
      user: USER_ID,
      status: "draft",
    },
  ];
  const MOCK_ARTICLE_CREATED = {
    title: "New Article",
    content: "Content of the new article.",
    user: USER_ID,
    status: "draft",
  };
  const MOCK_ARTICLE_UPDATED = {
    title: "Updated Article",
    content: "Updated content of the article.",
    status: "published",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(Article).toReturn(MOCK_ARTICLES, "find");
    mockingoose(Article).toReturn(MOCK_ARTICLE_CREATED, "save");
    mockingoose(Article).toReturn(MOCK_ARTICLE_UPDATED, "findOneAndUpdate");
    mockingoose(Article).toReturn(MOCK_ARTICLE_UPDATED, "deleteOne");
  });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_ARTICLE_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send(MOCK_ARTICLE_UPDATED)
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_ARTICLE_UPDATED.title);
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);
    expect(res.status).toBe(204);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
