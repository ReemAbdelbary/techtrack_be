const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  // need res to access res object
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    Gender: req.body.gender,
    Phone: req.body.phone,
  });
  const message = `<a>Welcome to Tech-Track, we're glad to have you 🎉🙏</a>`;

  await sendEmail(req.body.email, "Welcome On Board!😊", message);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //check if mail & password exists
  if (!email || !password) {
    return next(new AppError("please provide name and pass", 400));
  }

  //check if email and password are correct
  const user = await User.findOne({ email }).select("+password"); //because password was selected false

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("incorrect email or password", 401));
  }

  const token = signToken(user._id);
  return res.status(200).json({
    status: "success",
    token,
    role: user.role,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) get token and check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("you are not logged in, please log in to get access ", 401)
    );
  }
  // console.log(token);

  //2) verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //return user of this token

  //3) check if user still exists --> not deleted
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        "this user belonging to this token does no longer exist",
        401
      )
    );
  }

  //4) check if user changed password after token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("user recently changed passwoed! please log in again", 401)
    );
  }

  req.user = currentUser; // as we are in middleware so this will be available next in req info
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    //roles now contains [admin , user]
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("you do not have permission to do this action", 403)
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) get user based on POST email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("there is no user with email address", 404));
  }

  //2) generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3)send it to user email
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  try {
    const message = `forgot your password? submit patch request with new password and password confirm to:${resetURL}.\n
    if you did not forget password ignore this mail`;

    await sendEmail(req.body.email, "Password Reset", message);

    return res.status(200).json({
      status: "success",
      message: "token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new AppError("err sending mail try later"), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the token

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //2) if token has not expired and there is user --> set new password
  if (!user) {
    return next(new AppError("token is invalid or expired", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  //3) update passwordChangedAt for the user --> pre save middleware
  //4) log the user in, send JWT
  createSendToken(user, 201, res);
});

//works only for logged in users
exports.updatePassword = catchAsync(async (req, res, next) => {
  //since now user is signed in we can get through req body
  const user = await User.findById(req.user.id).select("+password"); //because password was selected false

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("your current password is wrong", 401));
  }

  //update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // log the user in, send JWT
  createSendToken(user, 201, res);
});

exports.getCurrentUser = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);

  req.user = currentUser; // as we are in middleware so this will be available next in req info
  next();
});

//foe sign up : name
// gender
// country
// email
// password
// confirm password
