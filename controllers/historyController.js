const axios = require("axios");
const Product = require("../models/productModel");
const User = require("../models/UserModel");
const Cfrecom = require("../models/CFrecomModel");

exports.searchHistory = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  // console.log(user.searchHistory);
  //check CF_recom for current user
  const flag = await Cfrecom.findOne({ userId: req.user });
  //list of ids from search model & CF_model
  const resultsArray = [];
  if (flag) {
    axios
      .get(
        "https://gastric-melita-graduat.koyeb.app/search_history/recommend",
        {
          data: {
            queries: user.searchHistory,
            quantity: 10,
          },
        }
      )
      .then(async (response) => {
        resultsArray.push(flag.recommend_0, flag.recommend_1, flag.recommend_2);
        const firstSevenResults = response.data.results.slice(0, 7);
        const combinedResults = [...firstSevenResults, ...resultsArray];
        console.log(combinedResults);
        const products = await Product.find({
          _id: { $in: combinedResults },
        }).select({ name: 1, price: 1, image_src: 1, site: 1, Rate_Avg: 1 });
        // console.log(response.data);
        return res.status(200).json({
          status: "success",
          results_size: products.length,
          products: products,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } else {
    axios
      .get(
        "https://gastric-melita-graduat.koyeb.app/search_history/recommend",
        {
          data: {
            queries: user.searchHistory,
            quantity: 10,
          },
        }
      )
      .then(async (response) => {
        const products = await Product.find({
          _id: { $in: response.data.results },
        }).select({ name: 1, price: 1, image_src: 1, site: 1, Rate_Avg: 1 });
        // console.log(response.data);
        return res.status(200).json({
          status: "success",
          results_size: products.length,
          products: products,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
};
