const Article = require("./articles.schema");

class ArticleService {
  create(data) {
    const article = new Article(data);
    return article.save();
  }

  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }

  delete(id) {
    return Article.deleteOne({ _id: id });
  }

  async getArticlesByUser(userId) {
    return Article.find({ user: userId }).populate({
      path: 'user',
      select: 'name email -_id', 
    });
  }
}

module.exports = new ArticleService();
