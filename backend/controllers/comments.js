const Article = require("../models/Article");
const Comment = require("../models/Comment");
const User = require("../models/User");

exports.paramsComment = (req, res, next, id) => {
  Comment.findById(id)
    .then(comment => {
      req.comment = comment;
      return next();
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed To Find Comment"
      });
    });
};

exports.getComments = (req, res, next) => {

  Promise.resolve(
    req.required !== null ? User.findById(req.required.userId) : null
  )
    .then(user => {
      req.article
        .populate({
          path: "comments",
          populate: {
            path: "author"
          },
          options: {
            sort: {
              created_at: "desc"
            }
          }
        })
        .execPopulate()
        .then(article => {

          if (typeof user === 'undefined' || user === null) {
            user = false;
          } 

          return res.status(200).json({
            comments: req.article.comments.map(comment => {
              return comment.toJSONUser(user);
            }),
            message: "Successfully got comments"
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "Failed To Find Comment"
          });
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed To Find User To Comment"
      });
    });
};

exports.postComment = (req, res, next) => {

  User.findById(req.required.userId)
    .then(user => {

      if (typeof user === "undefined" || user === null) {
        res.status(404).json({
          message: "Failed To Find Your User To Comment"
        });
      }

      const comment = new Comment();

      comment.body = req.body.body;
      comment.article = req.article;
      comment.author = user;

      return comment
        .save()
        .then(commentResponse => {

          req.article.comments.push(comment);

          return req.article.save().then(articleResponse => {

            return res.status(200).json({
              message: "Successfully created Comment on Article",
              comment: comment.toJSONUser(user)
            });
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Failed To Post Comment"
      });
    });
};

exports.putComment = (req, res, next) => {};

exports.deleteComment = (req, res, next) => {
  if (req.comment.author.toString() === req.required.userId.toString()) {
    req.article.comments.remove(req.comment._id);

    req.article.save().then(articleResponse => {
      Comment.findById(req.comment._id)
        .remove()
        .exec()
        .then(commentResponse => {
          res.status(200).json({
            data: commentResponse,
            message: "Successfully Deleted Comment"
          });
        });
    });
  } else {
    res.status(403).json({
      message: "Failed To Delete Comment"
    });
  }
};
