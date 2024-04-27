const User = require("../models/UserModel");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");

exports.addToFav_logged = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  console.log(req.user);
  console.log(productId);
  try {
    req.user.Favorites.push(productId);
    await User.findByIdAndUpdate(req.user.id, req.user, {
      new: true,
      runValidator: true,
    });
    return res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.error("Error adding product to favorites:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getMyFavorites = catchAsync(async (req, res, next) => {
  const user = req.user;
  try {
    const favorites_products = await Product.find({
      _id: { $in: req.user.Favorites },
    });
    return res.status(200).json({
      status: "success",
      results: favorites_products.length,
      data: {
        favorites_products,
      },
    });
  } catch (err) {
    console.error("Error adding product to favorites:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.RemoveFromFav_logged = catchAsync(async (req, res, next) => {
  const productId = req.params.id;
  //   console.log(req.user);
  //   console.log(productId);
  try {
    req.user.Favorites.pull(productId);
    await User.findByIdAndUpdate(req.user.id, req.user, {
      new: true,
      runValidator: true,
    });
    return res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    console.error("Error deleting product from favorites:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
