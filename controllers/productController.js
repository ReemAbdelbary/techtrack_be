const Product = require("../models/productModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("../controllers/handlerFactory");

exports.getallProducts = factory.getAll(Product);
exports.updateproduct = factory.updateOne(Product);
exports.deleteproduct = factory.deleteOne(Product);
exports.addnewproduct = factory.createOne(Product);

// exports.getProduct = factory.getOne(Product);

exports.getproduct = factory.getOne(Product, [
  { path: "reviews" },
  {
    path: "recommendations",
    populate: [
      { path: "Recommendation_1" },
      { path: "Recommendation_2" },
      { path: "Recommendation_3" },
      { path: "Recommendation_4" },
      { path: "Recommendation_5" },
      { path: "Recommendation_6" },
      { path: "Recommendation_7" },
      { path: "Recommendation_8" },
      { path: "Recommendation_9" },
      { path: "Recommendation_10" },
    ],
  },
]);
