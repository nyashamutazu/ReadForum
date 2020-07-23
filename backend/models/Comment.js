const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema(
  {
    body: {
      type: String,
      required: true
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);


class CommentClass {
  toJSONUser(user) {
    return {
      id: this._id,
      body: this.body,
      createAt: this.created_at,
      author: this.author.toProfileJSONUser(user)
    };
  }
}

CommentSchema.loadClass(CommentClass);

module.exports = mongoose.model("Comment", CommentSchema);
