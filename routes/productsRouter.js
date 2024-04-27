const express = require("express");

const router = express.Router();
const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRouter");

router.use("/:productId/reviews", reviewRouter);

//routers
router.route("/").get(productController.getallProducts);

router
  .route("/:id")
  .get(productController.getproduct)
  .patch(
    authController.protect,
    authController.restrictTo("admin"),
    productController.updateproduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin"),
    productController.deleteproduct
  );

module.exports = router;
