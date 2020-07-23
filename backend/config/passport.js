const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = mongoose.model("User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    (email, password, done) => {
      User.findOne({ email: email })
        .then(user => {
          if (
            typeof user === "undefined" ||
            user === null ||
            typeof user.validatePassword(password) === "undefined" ||
            user.validatePassword(password) === null
          ) {
            return done(null, false);
          }

          return done(null, user);
        })
        .catch(done);
    }
  )
);

