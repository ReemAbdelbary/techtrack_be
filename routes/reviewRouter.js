const express = require("express");
const reviewController = require("../controllers/reviewController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router.route("/").get(reviewController.getAllReviews);
router.route("/:id").get(reviewController.getReview);

router.use(authController.protect);

router
  .route("/")
  .post(
    authController.restrictTo("user"),
    reviewController.setProductUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .delete(authController.protect, reviewController.deleteReview) //by user for user review and for admin for any
  .patch(
    authController.protect,
    authController.restrictTo("user"),
    reviewController.updateReview
  ); // update is for users only

module.exports = router;
