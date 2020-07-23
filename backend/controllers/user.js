const mongoose = require("mongoose");
const User = mongoose.model("User");
const Article = require("../models/Article");

const passport = require("passport");

exports.createUser = (req, res, next) => {
  var user = new User({
    email: req.body.email,
    username: req.body.username
  });

  user.setPassword(req.body.password);

  user.token = user.createJWT();

  user
    .save()
    .then(result => {
      res.status(200).json({
        message: "Successfully created user",
        data: {
          user: user.toAuthJSON(),
          expiresIn: 3600
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getUser = (req, res, next) => {
  User.findById(req.required.userId)
    .then(user => {
      if (typeof user === "undefined" || user === null) {
        res.status(401).json({
          message: "Failed to successfully find user"
        });
      }

      res.status(200).json({
        message: "Successfully updated user",
        data: {
          user: user.toAuthJSON(),
          expiresIn: null
        }
      });
    })
    .catch(err => {});
};

exports.updateUser = (req, res, next) => {
  User.findById(req.required.userId)
    .then(user => {
      if (typeof user === "undefined" || user === null) {
        res.status(401).json({
          message: "Failed to successfully find user"
        });
      }

      if (typeof req.body.username !== "undefined") {
        user.username = req.body.username;
      }

      if (typeof req.body.email !== "undefined") {
        user.email = req.body.email;
      }

      if (typeof req.body.bio !== "undefined") {
        user.bio = req.body.bio;
      }

      if (typeof req.body.profileImage !== "undefined") {
        user.profileImage = req.body.profileImage;
      }

      user.save().then(responseUser => {
        res.status(200).json({
          message: "Successfully updated user",
          data: {
            user: user.toAuthJSON(),
            expiresIn: null
          }
        });
      });
    })
    .catch(err => {});
};

exports.loginUser = (req, res, next) => {
  if (typeof req.body.email === "undefined" || req.body.email === null) {

    res.status(422).json({
      message: "Please enter an email"
    });
  }

  if (typeof req.body.password === "undefined" || req.body.password === null) {

    res.status(422).json({
      message: "Please enter password"
    });
  }

  passport.authenticate("local", { session: false }, (err, user, info) => {

    if (err) {
      res.status(500).json({
        message: "Failed to authenticate"
      });
    }

    if (user) {

      user.token = user.createJWT();

      return res.status(200).json({
        message: "Successfully authenticated user",
        data: {
          user: user.toAuthJSON(),
          expiresIn: 3600
        }
      });
    } else {
      res.status(422).json({
        message: "Failed to authenticate"
      });
    }
  })(req, res, next);
};

exports.deleteUser = (req, res, next) => {

  User.findById(req.required.userId).then(user => {
    if (typeof user === "undefined" || user === null) {
      res.status(401).json({
        message: "Failed To Find Your User To Delete Article"
      });
    }

    Promise.all([
      Article.deleteMany({author: user._id}),
      Comment.deleteMany({author: user._id}),
      User.findByIdAndDelete(user._id)
    ]).then(response => {

      const articleResponse = response[0];
      const commentResponse = response[1];
      const userResponse = response[2];

      return res.status(204).json({
        message: "Successfully deleted User, Article and Comment"
      });

    }).catch(err => {
      res.status(500).json({
        message: "Failed to delete User, Article or Comment"
      });
    })

  }).catch(err => {
    res.status(404).json({
      message: "Error finding user"
    });
  });

};
