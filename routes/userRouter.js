const express = require("express");

const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router
  .post("/signup", authController.signUp)
  .post("/login", authController.login)
  .patch("/updateMe", authController.protect, userController.updateMe);

//router.delete("/deleteMe", authController.protect, userController.deleteMe);

router
  .post("/forgotPassword", authController.forgotPassword)
  .patch("/resetPassword/:token", authController.resetPassword)
  .patch(
    "/changeMyPassword",
    authController.protect,
    authController.updatePassword
  );

router.get("/me", authController.getCurrentUser, userController.getuser);

router.patch(
  "/makeAdmin/:id",
  authController.protect,
  authController.restrictTo("admin", "superAdmin"),
  userController.make_admin
);

router.patch(
  "/disableAdmin/:id",
  authController.protect,
  authController.restrictTo("admin", "superAdmin"),
  userController.disable_admin
);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo("admin", "superAdmin"),
    userController.getallusers
  ); //restrict the view for admins and superAmins only

module.exports = router;
