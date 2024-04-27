const axios = require("axios");
const Product = require("../models/productModel");
const User = require("../models/UserModel");

exports.searchHistory = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  // console.log(user.searchHistory);
  axios
    .get("https://gastric-melita-graduat.koyeb.app/search_history/recommend", {
      data: {
        queries: user.searchHistory,
        quantity: 10,
      },
    })
    .then(async (response) => {
      const products = await Product.find({
        _id: { $in: response.data.results },
      });
      console.log(response.data);
      res.status(200).json({
        status: "success",
        results_size: products.length,
        products: products,
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
