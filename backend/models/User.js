const mongoose = require("mongoose");
const unqiueValidator = require("mongoose-unique-validator");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let UserSchema = mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    // match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
    index: true
  },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    // match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
  },
  password: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ""
  },
  externalLink: {
    type: String,
    default: ""
  },
  profileImage: {
    type: String,
    default: ""
  },
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  blocked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  restrictedFrom: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  liked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article"
    }
  ],
  readLater: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article"
    }
  ]
});

UserSchema.plugin(unqiueValidator);

class UserClass {
  validatePassword(password) {
    return bcrypt
      .compare(password, this.password)
      .then(response => {
        return response;
      })
      .catch(err => {
        return false;
      });
  }

  setPassword(password) {
    bcrypt
      .hash(password, 10)
      .then(hash => {
        this.password = hash;
      })
      .catch(err => {
        console.log("Failed setting password");
      });
  }

  createJWT() {
    return jwt.sign(
      { email: this.email, userId: this._id, username: this.username },
      "user_secret",
      { expiresIn: "1h" }
    );
  };

  toAuthJSON() {
    return {
      username: this.username,
      email: this.email,
      token: this.createJWT(),
      bio: this.bio,
      externalLink: this.externalLink,
      profileImage: this.profileImage
    };
  };

  toAuthJSON() {
    return {
      username: this.username,
      email: this.email,
      token: this.createJWT(),
      bio: this.bio,
      externalLink: this.externalLink,
      profileImage: this.profileImage ||
      "https://taurangaelim.nz/wp-content/uploads/2019/05/placeholder-face-big.png",
    };
  };

  toProfileJSONUser(user) {
    return {
      username: this.username,
      bio: this.bio,
      externalLink: this.externalLink,
      profileImage:
        this.profileImage ||
        "https://taurangaelim.nz/wp-content/uploads/2019/05/placeholder-face-big.png",
      following: user ? user.isFollowing(this.id) : false
    };
  };

  like(id) {
    return this.addArray(this.liked, id);
  };

  unLike(id) {
    return this.removeArray(this.liked, id);
  };

  follow(id) {
    return this.addArray(this.following, id);
  };

  unfollow(id) {
    return this.removeArray(this.following, id);
  };

  followed(id) {
    return this.addArray(this.followers, id);
  }

  unfollowed(id) {
    return this.removeArray(this.followers, id);
  };

  block(id) {
    this.addArray(this.blocked, id);
  }

  unblock(id) {
    this.removeArray(this.blocked, id);
  }

  restricte(id) {
    this.addArray(this.restrictedFrom, id);
  }

  unrestricte(id) {
    this.removeArray(this.restrictedFrom, id);
  }

  isFollowing(id) {
    return this.following.some(followingId => {
      return followingId.toString() === id.toString();
    });
  };

  isLiked(id) {
    return this.liked.some(likedId => {
      return likedId.toString() === id.toString();
    });
  };


  addArray(array, value) {
    if (array.indexOf(value) === -1) {
      array.push(value)
    }

    return this.save();
  }

  removeArray(array, value) {
    array.remove(value);
    return this.save();
  }
}

UserSchema.loadClass(UserClass);

module.exports = mongoose.model("User", UserSchema);