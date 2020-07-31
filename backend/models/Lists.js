const mongoose = require("mongoose");
const unqiueValidator = require("mongoose-unique-validator");
const Article = require("./Article");

const ListSchema = mongoose.Schema(
  {
    private: {
      type: Boolean,
      required: true
    },
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
    },
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article"
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
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
