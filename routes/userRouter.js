const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router
  .post("/signup", authController.signUp)
  .post("/login", authController.login)
  .patch("/updateMe", authController.protect, userController.updateMe);

//router.delete("/deleteMe", authController.protect, userController.deleteMe);

//reset password needs update!!!!! (replace the token)
router
  .post("/forgotPassword", authController.forgotPassword)
  .patch("/resetPassword/:token", authController.resetPassword)
  .patch(
    "/changeMyPassword",
    authController.protect,
    authController.updatePassword
  );

router.get("/me", authController.getCurrentUser, userController.getuser);

//router.route("/").get(userController.getallusers) //restrict the view for auth users only

module.exports = router;
