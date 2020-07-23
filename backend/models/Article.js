const mongoose = require("mongoose");
const unqiueValidator = require("mongoose-unique-validator");
const User = require("./User");

const slug = require("slug");

const ArticleSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      lowercase: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    tagList: [
      {
        type: String,
        required: true
      }
    ],
    likeCount: {
      type: Number,
      required: true,
      default: 0
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ]
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

ArticleSchema.plugin(unqiueValidator);

class ArticleClass {
  slugify() {
    this.slug =
      slug(this.title) +
      "-" +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }

  updateLikedCount() {
    const article = this;

    return User.count({ likes: { $in: [article._id] } }).then(count => {
      article.likeCount = count;

      return article.save();
    });
  }

  toJSONUser(user) {
    return {
      slug: this.slug,
      title: this.title,
      description: this.description,
      body: this.body,
      tagList: this.tagList,
      createdAt: new Date(this.created_at).toLocaleDateString(),
      updatedAt: this.updated_at,
      liked: user ? user.isLiked(this._id) : false,
      likeCount: this.likeCount,
      author: this.author.toProfileJSONUser(user)
    };
  }
}

ArticleSchema.pre("validate", function(next) {
  if (typeof this.slug === 'undefined' || this.slug === null) {
    this.slugify();
  }

  next();
});

ArticleSchema.loadClass(ArticleClass);

module.exports = mongoose.model("Article", ArticleSchema);