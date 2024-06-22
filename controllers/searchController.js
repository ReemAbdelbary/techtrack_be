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

// Define the filter function
function filter(queryString, query) {
  const searchTerm = queryString.q;
  const page = queryString.page || 1;
  const limit = queryString.limit || 100;

  const queryObj = { ...queryString };
  const excluded = ["page", "limit", "sort", "fields", "q"];
  excluded.forEach((el) => delete queryObj[el]);

  // 1B) advanced filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
  // this.query.find(JSON.parse(queryStr));

  queryStr = JSON.parse(queryStr); //Convert the string to a JSON object

  console.log(queryStr);
  Object.keys(queryStr).forEach((key) => {
    if (isNaN(queryStr[key]) && typeof queryStr[key] !== "object") {
      console.log(queryStr[key]);
      queryStr[key] = { $regex: new RegExp(queryStr[key], "i") };
    }
  });

  if (searchTerm) {
    queryStr.name = { $regex: searchTerm, $options: "i" };
  }
  query.find(queryStr);
  return query;
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

    // Apply filtering
    const filteredQuery = filter(req.query, Product.find()).sort({ price: 1 });

    // Count the total number of documents matching the filtered criteria
    const totalResults = await Product.countDocuments(filteredQuery);

    // Perform the search with pagination
    const searchResults = await filteredQuery
      .sort({ price: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select({
        name: 1,
        price: 1,
        image_src: 1,
        site: 1,
        Rate_Avg: 1,
        Accessories_type: 1,
        category: 1,
      });

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
    // Apply filtering
    const filteredQuery = filter(req.query, Product.find()).sort({ price: 1 });

    // Count the total number of documents matching the filtered criteria
    const totalResults = await Product.countDocuments(filteredQuery);

    // Perform the search with pagination
    const searchResults = await filteredQuery
      .sort({ price: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select({ name: 1, price: 1, image_src: 1, site: 1, Rate_Avg: 1 });

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
