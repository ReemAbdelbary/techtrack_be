const Review = require("../models/reviewModel");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIfeatures = require("../utils/apiFeatures");

exports.setProductUserIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.createReview = factory.createOne(Review);

exports.deleteReview = catchAsync(async (req, res, next) => {
  const userlog = req.user;
  // console.log(userlog.role);
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("NO Document found with this id", 404));
  }

  if (userlog.role == "admin" || userlog.role == "superAdmin") {
    const doc = await Review.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("NO Document found with this id", 404));
    }

    return res.status(204).json({
      status: "success",
      data: null,
    });
  } else {
    // console.log(userlog.id);
    // console.log(review.user._id);
    if (userlog.id == review.user._id) {
      const doc = await Review.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(new AppError("NO Document found with this id", 404));
      }

      return res.status(204).json({
        status: "success",
        data: null,
      });
    } else {
      return next(new AppError("User can't delete other users reviews", 401));
    }
  }
});

exports.updateReview = catchAsync(async (req, res, next) => {
  const userlog = req.user;
  // console.log(userlog.role);
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("NO Document found with this id", 404));
  }
  if (
    req.body.rating === "" ||
    req.body.rating === null ||
    req.body.rating === undefined
  ) {
    return next(
      new AppError("Rating is required and cannot be empty or null", 400)
    );
  }
  if (userlog.id == review.user._id) {
    const doc = await Review.findByIdAndUpdate(req.params.id, req.body, {
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
  } else {
    return next(new AppError("User can't update other users reviews", 401));
  }
});

exports.getReview = factory.getOne(Review);
exports.getAllReviews = factory.getAll(Review);

exports.getUserReviews = catchAsync(async (req, res, next) => {
  const filter = { user: req.user.id };
  const doc = await Review.find(filter);

  // SEND RESPONSE
  return res.status(200).json({
    status: "success",
    results: doc.length,
    data: {
      data: doc,
    },
  });
});
