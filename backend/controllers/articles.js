const Article = require("../models/Article");
const User = require("../models/User");

exports.paramsArticle = (req, res, next, slug) => {
  Article.findOne({ slug: slug })
    .populate("author")
    .then(article => {
      if (typeof article === "undefined" || article === null) {
        res.status(404).json({
          message: "Failed To Find Article"
        });
      }

      req.article = article;
      return next();
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed To Find Article"
      });
    });
};

exports.postArticle = (req, res, next) => {
  User.findById(req.required.userId)
    .then(user => {
      if (typeof user === "undefined" || user === null) {
        res.status(404).json({
          message: "Failed To Find Your User To Post Article"
        });
      }

      const article = new Article(req.body.article);

      article.author = user;

      article
        .save()
        .then(() => {
          user
            .updateArticleCount()
            .then(done => {
              res.status(200).json({
                message: "Successfully created Article",
                article: article.toJSONUser(done)
              });
            })
            .catch(err => console.log("Failed to update count", err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => {
      res.status(404).json({
        message: "Error posting article"
      });
    });
};

exports.getRecentArticles = (req, res, next) => {
  let query = {};
  let limit = 20;
  let offset = 0;
  let requester;

  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }

  if (typeof req.query.tag !== "undefined") {
    query.tagList = { $in: [req.query.tag] };
  }

  if (typeof req.query.tag !== "undefined") {
    const regex = new RegExp(req.query.tag, "i");
    query.tagList = { $in: [regex] };
  }

  for (let i in req.query) {
    if (i.toString() !== "limit" && i.toString() !== "offset") {
      requester = i;
    }
  }

  Promise.all([
    req.query.author ? User.findOne({ username: req.query.author }) : null,
    requester ? User.findOne({ username: req.query[`${requester}`] }) : null
  ])
    .then(results => {
      const author = results[0];
      const response = results[1];

      if (author) {
        query.author = author._id;
      } else {
        if (response) {
          query._id = { $in: response[`${requester}`] };
        } else if (req.query[`${requester}`]) {
          // query._id = { $in: [] };
        }
      }

      return Promise.all([
        Article.find(query)
          .limit(Number(limit))
          .skip(Number(offset))
          .sort({ created_at: "descending" })
          .populate("author")
          .exec(),
        Article.count(query).exec(),
        req.required ? User.findById(req.required.userId) : null
      ]).then(results => {
        const articles = results[0];
        const articlesCount = results[1];
        const user = results[2];

        return res.json({
          message: "Found articles",
          articles: articles.map(article => {
            return article.toJSONUser(user);
          }),
          articlesCount: articlesCount
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to get global feed for user"
      });
    });
};

exports.getFeedArticles = (req, res, next) => {
  authenticatedRequest(req);

  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }

  User.findById(req.required.userId)
    .then(user => {
      if (typeof user === "undefined" || user === null) {
        return res.status(401).json({
          message: "Failed to find user for feed"
        });
      }

      Promise.all([
        Article.find({ author: { $in: user.following } })
          .limit(Number(limit))
          .skip(Number(offset))
          .sort({ created_at: "descending" })
          .populate("author")
          .exec(),
        Article.count({ author: { $in: user.following } })
      ])
        .then(results => {
          var articles = results[0];
          var articlesCount = results[1];

          return res.status(200).json({
            message: "Found articles",
            articles: articles.map(article => {
              return article.toJSONUser(user);
            }),
            articlesCount: articlesCount
          });
        })
        .catch(err => {
          console(err);

          res.status(500).json({
            message: "Failed to get feed for user"
          });
        });
    })
    .catch(err => {
      console(err);
      res.status(500).json({
        message: "Failed to get feed for user"
      });
    });
};

exports.getLikedArticles = (req, res, next) => {
  authenticatedRequest(req);

  var limit = 20;
  var offset = 0;

  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }

  User.findById(req.required.userId)
    .then(user => {
      if (typeof user === "undefined" || user === null) {
        return res.status(401).json({
          message: "Failed to find user for feed"
        });
      }

      Promise.all([
        Article.find({ author: { $in: user.liked } })
          .limit(Number(limit))
          .skip(Number(offset))
          .populate("author")
          .exec(),
        Article.count({ author: { $in: user.liked } })
      ])
        .then(results => {
          var articles = results[0];
          var articlesCount = results[1];

          return res.status(200).json({
            message: "Found articles",
            articles: articles.map(article => {
              return article.toJSONUser(user);
            }),
            articlesCount: articlesCount
          });
        })
        .catch(err => {
          console(err);

          res.status(500).json({
            message: "Failed to get liked for user"
          });
        });
    })
    .catch(err => {
      console(err);
      res.status(500).json({
        message: "Failed to get liked for user"
      });
    });
};

exports.getReadLaterArticles = (req, res, next) => {};

exports.userArticles = (req, res, next) => {};

exports.getArticle = (req, res, next) => {
  return Promise.all([
    req.required !== null ? User.findById(req.required.userId) : null,
    req.article.populate("author").execPopulate()
  ])
    .then(result => {
      const user = result[0];

      if (typeof req.required === "undefined" || req.required === null) {
        return res.status(200).json({
          message: "Found articles",
          article: req.article.toJSONUser(false)
        });
      } else {
        return res.status(200).json({
          message: "Found articles",
          article: req.article.toJSONUser(user)
        });
      }
    })
    .catch(err => {
      console.log("Error", err);
    });
};

exports.articleSearch = (req, res, next) => {
  let limit = 20;
  let offset = 0;

  if (typeof req.query.limit !== "undefined" || req.query.limit !== null) {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== "undefined" || req.query.offset !== null) {
    offset = req.query.offset;
  }

  const regex = new RegExp(req.query.title, "i");

  Promise.all([
    Article.find({
      $or: [{ title: regex }, { description: regex }, { body: regex }]
    })
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ created_at: "descending" })
      .populate("author")
      .exec(),
    req.required ? User.findById(req.required.userId) : null
  ])
    .then(results => {
      const articles = results[0];
      const user = results[1];

      return res.status(200).json({
        message: "Found articles",
        articles: articles.map(article => {
          return article.toJSONUser(user);
        })
      });
    })
    .catch(err => {
      console(err);
      res.status(500).json({
        message: "Failed to get feed for user"
      });
    });
};

exports.trendingSearch = (req, res, next) => {};

exports.likeArticle = (req, res, next) => {
  const articleId = req.article._id;

  User.findById(req.required.userId)
    .then(user => {
      if (typeof user === "undefined" || user === null) {
        res.status(401).json({
          message: "Failed To Find Your User To Like Article"
        });
      }

      return user
        .like(articleId)
        .then(() => {
          return req.article.updateLikedCount().then(article => {
            return res.status(202).json({
              article: article.toJSONUser(user),
              message: "Successfully Liked article"
            });
          });
        })
        .catch(err => {
          res.status(403).json({
            message: "Failed To Like Article"
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed To Like Article"
      });
    });
};

exports.putArticle = (req, res, next) => {
  User.findById(req.required.userId)
    .then(user => {
      if (req.article.author._id.toString() === req.required.userId) {
        if (typeof req.body.article.title !== "undefined") {
          req.article.title = req.body.article.title;
          req.article.slugify();
        }

        if (typeof req.body.article.description !== "undefined") {
          req.article.description = req.body.article.description;
        }

        if (typeof req.body.article.body !== "undefined") {
          req.article.body = req.body.article.body;
        }

        if (typeof req.body.article.tagList !== "undefined") {
          req.article.tagList = req.body.article.tagList;
        }

        req.article.save().then(article => {
          res.status(200).json({
            message: "Successfully updated Article",
            article: article.toJSONUser(user)
          });
        });
      }
    })
    .catch(err => {
      res.status(404).json({
        message: "Error updating article"
      });
    });
};

exports.deleteArticle = (req, res, next) => {
  console.log(1);
  User.findById(req.required.userId)
    .then(user => {
      console.log(2);

      if (typeof user === "undefined" || user === null) {
        res.status(401).json({
          message: "Failed To Find Your User To Delete Article"
        });
      }

      if (
        req.required.userId.toString() === req.article.author._id.toString()
      ) {
        console.log(4);

        return req.article.remove().then(result => {
          res.status(204).json({
            message: "Successfully deleted article"
          });
        });
      } else {
        console.log(5);

        res.status(403).json({
          message: "Failed To Delete Article"
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed To Delete Article"
      });
    });
};

exports.unlikeArticle = (req, res, next) => {
  console.log(1);
  const articleId = req.article._id;

  User.findById(req.required.userId)
    .then(user => {
      console.log(2);

      if (typeof user === "undefined" || user === null) {
        res.status(401).json({
          message: "Failed To Find Your User To Unlike Article"
        });
      }
      console.log(3);

      return user
        .unLike(articleId)
        .then(() => {
          console.log(4);

          return req.article.updateLikedCount().then(article => {
            console.log(5);

            return res.status(202).json({
              article: article.toJSONUser(user),
              message: "Successfully Unliked article"
            });
          });
        })
        .catch(err => {
          console.log(err);
          res.status(403).json({
            message: "Failed To Like Article"
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Failed To Unlike Article"
      });
    });
};

const authenticatedRequest = req => {
  if (typeof req.required === "undefined" || req.required === null) {
    res.status(500).json({
      message: "Failed to get feed for user"
    });
  }
};
