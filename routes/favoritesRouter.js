const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const favorites = require("../controllers/favController");

router
  .route("/:id")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    favorites.addToFav_logged
  )
  .delete(
    authController.protect,
    authController.restrictTo("user"),
    favorites.RemoveFromFav_logged
  );

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("user"),
    favorites.getMyFavorites
  );

module.exports = router;
