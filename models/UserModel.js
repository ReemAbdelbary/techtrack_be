const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please provide your name"],
  },
  email: {
    type: String,
    required: [true, "user must have email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide valid email"],
  },
  photo: {
    type: String,
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },

  password: {
    type: String,
    required: [true, "please provide password"],
    minlength: 8,
    select: false, //to hide password
  },

  passwordConfirm: {
    type: String,
    required: [true, "please confirm password"],
    // this validator works only on create or save
    // won't work for findOneAndUpdate !!!
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "are not the same",
    },
  },

  passwordChangedAt: {
    type: Date,
  },

  passwordResetToken: { type: String },
  passwordResetExpires: {
    type: Date,
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  searchHistory: {
    type: Array,
    default: [],
  },
  Favorites: {
    type: Array,
    default: [],
  },
  Gender: {
    type: String,
    enum: ["male", "female"],
  },
  Phone: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, "Please fill a valid 10-digit phone number"],
  },
});

userSchema.pre("save", async function (next) {
  //only run if password is modified
  if (!this.isModified("password")) {
    return next();
  }
  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete passconfirm from DB
  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(JWTTimestamp, changedTimestamp);
    return JWTTimestamp < changedTimestamp; //100<200 true then changed
  }
  return false; // password is not changed
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log(resetToken);

  this.passwordResetExpires = Date.now() + 10 * 1000 * 60;
  return resetToken;
};
const User = mongoose.model("User", userSchema);
module.exports = User;
