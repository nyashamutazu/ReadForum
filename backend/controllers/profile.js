const User = require("../models/User");

exports.getUserProfile = (req, res, next, username) => {
  User.findOne({ username: username })
    .then(user => {
      if (typeof user === "undefined" || user === null) {
        res.status(404).json({
          message: "Error finding user"
        });
      }

      req.profile = user;

      return next();
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed getting finding user"
      });
    });
};

exports.getUser = (req, res, next) => {
  if (typeof req.required === "undefined" || req.required === null) {
    return res.status(200).json({
      message: "Failed To Find User",
      profile: req.profile.toProfileJSONUser(false)
    });
  } else {
    User.findById(req.required.userId)
      .then(user => {
        if (typeof user === "undefined" || user === null) {
          res.status(404).json({
            message: "Failed To Find Your User"
          });
        }

        return res.status(202).json({
          message: "Found User",
          profile: req.profile.toProfileJSONUser(user)
        });
      })
      .catch(err => {});
  }
};

exports.followUser = (req, res, next) => {
  const profileId = req.profile._id;

  Promise.all([User.findById(req.required.userId), User.findById(profileId)])
    .then(results => {
      const user = results[0];
      const profile = results[1];

      if (typeof user === "undefined" || user === null) {
        res.status(404).json({
          message: "Error finding user"
        });
      }

      if (typeof profile === "undefined" || profile === null) {
        res.status(404).json({
          message: "Error finding profile"
        });
      }

      return user.follow(profileId).then(() => {
        return profile
          .followed(user._id)
          .then(() => {
            return res.status(202).json({
              message: "Found User And Followed",
              profile: req.profile.toProfileJSONUser(user)
            });
          })
          .catch(err => {
            console.log("follow err 1", err);
          });
      }).catch(err => {
        console.log("follow err 2", err);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Failed To Follow User"
      });
    });
};

exports.unfollowUser = (req, res, next) => {
  const profileId = req.profile._id;

  Promise.all([User.findById(req.required.userId), User.findById(profileId)])
    .then(results => {
      const user = results[0];
      const profile = results[1];

      if (typeof user === "undefined" || user === null) {
        res.status(404).json({
          message: "Error finding user"
        });
      }

      if (typeof profile === "undefined" || profile === null) {
        res.status(404).json({
          message: "Error finding profile"
        });
      }

      return user.unfollow(profileId).then(() => {
        return profile.unfollowed(user._id).then(() => {
          return res.status(202).json({
            message: "Found User And Followed",
            profile: req.profile.toProfileJSONUser(user)
          });
        }).catch(err => {
          console.log("unfollow err 1", err);
        });;
      }).catch(err => {
        console.log("unfollow err 2", err);
      });;
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed To UnFollow User"
      });
    });
};

exports.blockUser = (req, res, next) => {
  const profileId = req.profile._id;

  Promise.all([User.findById(req.required.userId), User.findById(profileId)])
    .then(results => {
      const user = results[0];
      const profile = results[1];

      if (typeof user === "undefined" || user === null) {
        res.status(404).json({
          message: "Error finding user"
        });
      }

      if (typeof profile === "undefined" || profile === null) {
        res.status(404).json({
          message: "Error finding profile"
        });
      }
      return user.block(profileId).then(() => {
        return profile.restricte(user._id).then(() => {
          return res.status(202).json({
            message: "Found User And Blocked",
            profile: req.profile.toProfileJSONUser(user)
          });
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed To Block User"
      });
    });
};

exports.unblockUser = (req, res, next) => {
  const profileId = req.profile._id;

  Promise.all([User.findById(req.required.userId), User.findById(profileId)])
    .then(results => {
      const user = results[0];
      const profile = results[1];

      if (typeof user === "undefined" || user === null) {
        res.status(404).json({
          message: "Error finding user"
        });
      }

      if (typeof profile === "undefined" || profile === null) {
        res.status(404).json({
          message: "Error finding profile"
        });
      }

      return user.unblock(profileId).then(() => {
        return profile.unrestricte(user._id).then(() => {
          return res.status(202).json({
            message: "Found User And Unblocked",
            profile: req.profile.toProfileJSONUser(user)
          });
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed To UnFollow User"
      });
    });
};
