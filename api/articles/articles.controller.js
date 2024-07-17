const articleService = require("./articles.service");
const UnauthorizedError = require("../../errors/unauthorized");

class ArticlesController {
  async create(req, res, next) {
    try {
      const { user } = req;
      if (!user) {
        throw new UnauthorizedError("User must be logged in to create an article");
      }
      const articleData = {
        ...req.body,
        user: user._id,
      };
      const article = await articleService.create(articleData);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { user } = req;
      if (user.role !== "admin") {
        throw new UnauthorizedError("Only admins can update articles");
      }
      const { id } = req.params;
      const article = await articleService.update(id, req.body);
      req.io.emit("article:update", article);
      res.json(article);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const { user } = req;
      if (user.role !== "admin") {
        throw new UnauthorizedError("Only admins can delete articles");
      }
      const { id } = req.params;
      await articleService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
