const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const favorites = require("../controllers/favController");

router
  .route("/:id")
  .post(authController.protect, favorites.addToFav_logged)
  .delete(authController.protect, favorites.RemoveFromFav_logged);

router.route("/").get(authController.protect, favorites.getMyFavorites);

module.exports = router;
