const User = require("../models/UserModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const authController = require("./authController");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

//for admin if needed
exports.getallusers = catchAsync(async (req, res) => {
  const users = await User.find();
  res
    .status(200)
    .json({ status: "success", results: users.length, data: { users } });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("this route is not for password updates", 400));
  }
  // state which fields are allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email", "Gender", "phone");

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// marking them as not active
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  return res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getuser = catchAsync(async (req, res, next) => {
  let query = User.findById(req.user.id);
  const doc = await query;
  if (!doc) {
    return next(new AppError("No document found with that ID", 404));
  }
  return res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.make_admin = catchAsync(async (req, res, next) => {
  const update = { role: "admin" };
  const doc = await User.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidator: true,
  });

  if (!doc) {
    return next(new AppError("NO Document found with this id", 404));
  }
  return res.status(200).json({
    status: "success",
    data: {
      data: doc,
    },
  });
});

exports.disable_admin = catchAsync(async (req, res, next) => {
  let current = await User.findById(req.params.id);
  if (current.role == "superAdmin") {
    return next(
      new AppError("you do not have permission to do this action", 403)
    );
  } else {
    const update = { role: "user" };
    const doc = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidator: true,
    });

    if (!doc) {
      return next(new AppError("NO Document found with this id", 404));
    }
    return res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  }
});
