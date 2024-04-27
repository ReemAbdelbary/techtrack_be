const catchAsync = require("../utils/catchAsync");
const Product = require("../models/productModel");
const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");

exports.getallLaptops = catchAsync(async (req, res, next) => {
  try {
    // Perform the search logic using your Mongoose model
    const laptopsResults = await Product.find({ category: "Laptops" });

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      results: laptopsResults.length,
      data: {
        laptopsResults,
      },
    });
  } catch (err) {
    console.error("Error searching laptops:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getallMobiles = catchAsync(async (req, res, next) => {
  try {
    // Perform the search logic using your Mongoose model
    const mobilesResults = await Product.find({ category: "Mobiles" });

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      results: mobilesResults.length,
      data: {
        mobilesResults,
      },
    });
  } catch (err) {
    console.error("Error searching mobiles:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getallAcces = catchAsync(async (req, res, next) => {
  try {
    // Perform the search logic using your Mongoose model
    const accResults = await Product.find({ category: "Accessories" });

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      results: accResults.length,
      data: {
        accResults,
      },
    });
  } catch (err) {
    console.error("Error searching accessories:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getTopRated = catchAsync(async (req, res, next) => {
  try {
    const topRatedProducts = await Product.find()
      .sort({ Rate_Avg: -1 }) // Sort by Rate_Avg in descending order (highest to lowest)
      .limit(4);

    return res.status(200).json({
      status: "success",
      results: topRatedProducts.length,
      data: {
        topRatedProducts,
      },
    });
  } catch (err) {
    console.error("Error fetching top rated products:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getallRaya = catchAsync(async (req, res, next) => {
  try {
    // Perform the search logic using your Mongoose model
    const rayaResults = await Product.find({ site: "Raya" });

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      results: rayaResults.length,
      data: {
        rayaResults,
      },
    });
  } catch (err) {
    console.error("Error searching Raya site:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getallNoon = catchAsync(async (req, res, next) => {
  try {
    // Perform the search logic using your Mongoose model
    const noonResults = await Product.find({ site: "Noon" });

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      results: noonResults.length,
      data: {
        noonResults,
      },
    });
  } catch (err) {
    console.error("Error searching Noon site:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getallAmazon = catchAsync(async (req, res, next) => {
  try {
    // Perform the search logic using your Mongoose model
    const amazonResults = await Product.find({ site: "amazon" });

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      results: amazonResults.length,
      data: {
        amazonResults,
      },
    });
  } catch (err) {
    console.error("Error searching Amazon site:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getallBtech = catchAsync(async (req, res, next) => {
  try {
    // Perform the search logic using your Mongoose model
    const btechResults = await Product.find({ site: "BTECH" });

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      results: btechResults.length,
      data: {
        btechResults,
      },
    });
  } catch (err) {
    console.error("Error searching Btech site:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getallKimo = catchAsync(async (req, res, next) => {
  try {
    // Perform the search logic using your Mongoose model
    const kimoResults = await Product.find({ site: "Kimo Store" });

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      results: kimoResults.length,
      data: {
        kimoResults,
      },
    });
  } catch (err) {
    console.error("Error searching Kimo store site:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getallTwoB = catchAsync(async (req, res, next) => {
  try {
    // Perform the search logic using your Mongoose model
    const twoBResults = await Product.find({ site: "2b" });

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      results: twoBResults.length,
      data: {
        twoBResults,
      },
    });
  } catch (err) {
    console.error("Error searching 2b site:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getallDream = catchAsync(async (req, res, next) => {
  try {
    // Perform the search logic using your Mongoose model
    const dreamResults = await Product.find({ site: "dream2000" });

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      results: dreamResults.length,
      data: {
        dreamResults,
      },
    });
  } catch (err) {
    console.error("Error searching Dream 2000 site:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
