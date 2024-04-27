const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const authController = require("../controllers/authController");
router
  .route("/")
  .get(
    authController.getCurrentUser,
    searchController.getAllSearchResults_logged
  );

module.exports = router;
