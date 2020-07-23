const Article = require("../models/Article");

exports.getAll = (req, res, next) => {
  Article.find()
    .distinct("tagList")
    .sort()
    .then(tags => {
      res.status(202).json({
        message: "Successfully retrieved tags",
        tags
      });
    })
    .catch(err => {
      console.log(err);
        res.status(500).json({
          message: "Failed to retrieve tags"
        });
    });
};
