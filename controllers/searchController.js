const User = require("../models/UserModel");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");

function addToBeginning(arr, element) {
  // If array length is less than 5, simply unshift the element
  if (arr.length < 5) {
    arr.unshift(element);
  } else {
    // If array length is 5, remove the last element before unshifting
    arr.pop();
    arr.unshift(element);
  }
}

exports.getAllSearchResults_logged = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.q;
  const page = req.query.page || 1; // Get the page number from the request query or default to 1
  const limit = req.query.limit || 100; // Get the limit from the request query or default to 10

  try {
    //add to user history
    //console.log(req.user);

    if (req.user) {
      addToBeginning(req.user.searchHistory, searchTerm);
    }
    // req.user.searchHistory.push(searchTerm);

    // console.log(req.user);

    await User.findByIdAndUpdate(req.user.id, req.user, {
      new: true,
      runValidator: true,
    });

    ////////////////////

    // Count the total number of documents matching the search criteria
    const totalResults = await Product.countDocuments({
      name: { $regex: searchTerm, $options: "i" },
    });

    // Perform the search logic using your Mongoose model
    const searchResults = await Product.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .sort({ price: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      total: totalResults,
      results_page: searchResults.length,
      data: {
        searchResults,
      },
    });
  } catch (err) {
    console.error("Error searching products:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

exports.getAllSearchResults = catchAsync(async (req, res, next) => {
  const searchTerm = req.query.q;
  const page = req.query.page || 1; // Get the page number from the request query or default to 1
  const limit = req.query.limit || 100; // Get the limit from the request query or default to 10

  try {
    // Perform the search logic using your Mongoose model
    const searchResults = await Product.find({
      name: { $regex: searchTerm, $options: "i" },
    })
      .sort({ price: 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Send the search results as JSON to the client
    return res.status(200).json({
      status: "success",
      results: searchResults.length,
      data: {
        searchResults,
      },
    });
  } catch (err) {
    console.error("Error searching products:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
