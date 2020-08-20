const User = require("../models/User");
const Article = require("../models/Article");

exports.getUserProfile = (req, res, next, username) => {
  User.findOne({ username: username })
    .then(user => {
      if (typeof user === "undefined" || user === null) {
        res.status(404).json({
          message: "Error finding user"
        });
      }

      Article.count({ author: user._id })
        .then(amount => {
          user.articleCount = Number(amount);

          return user.save();
        })
        .then(user => {
          req.profile = user;

          return next();
        });
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed getting finding user"
      });
    });
};

exports.profileSearch = (req, res, next) => {
  console.log(1)
  let limit = 20;
  let offset = 0;

  if (typeof req.query.limit !== "undefined" || req.query.limit !== null) {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== "undefined" || req.query.offset !== null) {
    offset = req.query.offset;
  }

  const regex = new RegExp(req.query.username, "i");

  Promise.all([
    User.find({ username: regex })
      .limit(Number(limit))
      .skip(Number(offset))
      .sort({ created_at: "descending" })
      .populate("author")
      .exec(),
    req.required ? User.findById(req.required.userId) : null
  ])
    .then(results => {
      const profiles = results[0];
      const user = results[1];

      console.log(req);

      return res.status(200).json({
        message: "Found User And Followed",
        profiles: profiles.map(profile => {
          return profile.toProfileJSONUser(user);
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Failed to get feed for user"
      });
    });
};

exports.getUser = (req, res, next) => {
  if (typeof req.required === "undefined" || req.required === null) {
    return res.status(200).json({
      message: "User Not Logged In",
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
      .catch(err => {
        console.log("Failed Big Time");
      });
  }
};

exports.usersFollowQuery = (req, res, next) => {
  let limit = 20;
  let offset = 0;
  let requester;

  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }


  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }

  for (let i in req.query) {
    if (i.toString() !== "limit" && i.toString() !== "offset") {
      requester = i;
    }
  }

  Promise.all([
    User.findById({ $in: req.profile[`${requester}`]})
      .limit(Number(limit))
      .skip(Number(offset))
      .populate("_id")
      .exec(),
    req.required ? User.findById(req.required.userId) : null
  ])
    .then(results => {
      const profiles = results[0] || [];
      const user = results[1];

      return res.status(200).json({
        message: "Found profiles",
        profiles: profiles.map(profile => {
          return profile.toProfileJSONUser(user);
        }) 
      });
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: "Failed to get profiles"
      });
    });
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

      return user
        .follow(profileId)
        .then(() => {
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
        })
        .catch(err => {
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

      return user
        .unfollow(profileId)
        .then(() => {
          return profile
            .unfollowed(user._id)
            .then(() => {
              return res.status(202).json({
                message: "Found User And Followed",
                profile: req.profile.toProfileJSONUser(user)
              });
            })
            .catch(err => {
              console.log("unfollow err 1", err);
            });
        })
        .catch(err => {
          console.log("unfollow err 2", err);
        });
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
