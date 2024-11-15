const Article = require("./articles.schema");
const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");

class ArticlesController {
  async create(req, res, next) {
    try {
      const article = new Article({
        ...req.body,
        user: req.user.userId, 
      });
      const savedArticle = await article.save();
      req.io.emit("article:create", savedArticle); 
      res.status(201).json(savedArticle);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new UnauthorizedError("Only admins can update articles");
      }
      const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!article) {
        throw new NotFoundError("Article not found");
      }
      req.io.emit("article:update", article); 
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        throw new UnauthorizedError("Only admins can delete articles");
      }
      const deletedArticle = await Article.findByIdAndDelete(req.params.id);
      if (!deletedArticle) {
        throw new NotFoundError("Article not found");
      }
      req.io.emit("article:delete", { id: req.params.id }); 
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async getByUser(req, res, next) {
    try {
      const articles = await Article.find({ user: req.params.userId }).populate({
        path: "user",
        select: "name email",
      });
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
