const express = require("express");

const router = express.Router();
const historyController = require("../controllers/historyController");
const authController = require("../controllers/authController");

//routers
router
  .route("/")
  .get(authController.getCurrentUser, historyController.user_rec);

module.exports = router;
