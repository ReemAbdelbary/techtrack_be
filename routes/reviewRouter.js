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
  .delete(
    authController.restrictTo("admin", "user"),
    reviewController.deleteReview
  )
  .patch(
    authController.restrictTo("admin", "user"),
    reviewController.updateReview
  );

module.exports = router;
