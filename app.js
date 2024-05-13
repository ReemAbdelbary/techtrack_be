const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const app = express();
const cors = require("cors");
// adding cors
//
app.use(cors());

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productsRouter");
const reviewRouter = require("./routes/reviewRouter");
const searchRouter = require("./routes/searchRouter");
const searchLogged = require("./routes/searchloggedRouter");
const reviewUserRouter = require("./routes/reviewUserRouter");
const homeController = require("./controllers/homeController");
const favoritesRouter = require("./routes/favoritesRouter");
const chatRouter = require("./routes/chatRouter");
const historyRouter = require("./routes/historyRouter");
const recRouter = require("./routes/recRouter");

//1) MIDDLE WARES

//1) MIDDLE WARES
//Set security HTTP headers
app.use(helmet());

//limit requests from same IP
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000, //hour to milleseconds
  message: "Too many requests from this IP , please try again in an hour",
});
app.use("/api", limiter);

//Body parser to read data from body
app.use(express.json()); // ables access to req body

//Data sanitization aganist NOSql queries
app.use(mongoSanitize());

//Data sanitization aganist XSS
app.use(xss());

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       "category",
//       "price",
//       "site",
//       "Rate_Avg",
//       "Rate_Qty",
//       "Accessories_type",
//     ],
//   })
// );

app.use(morgan("dev")); //GET /api/v1/tours 200 146.553 ms - 1065

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/searchlogged", searchLogged);
app.use("/api/v1/Myreviews", reviewUserRouter);
app.use("/api/v1/favorites", favoritesRouter);
app.use("/api/v1/chatbot", chatRouter);
app.use("/api/v1/recs", recRouter); // product rec
app.use("/api/v1/user-Rec", historyRouter); // user recomend (review + search)
app.get("/api/v1/top-rated", homeController.getTopRated);

app.all("*", (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this server`, 404)); //next(error)
}); //for any unspecified route

app.use(globalErrorHandler);

module.exports = app;
