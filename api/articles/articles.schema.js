const { Schema, model } = require("mongoose");

const articleSchema = new Schema({
  title: String,
  content: String,
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Article", articleSchema);
