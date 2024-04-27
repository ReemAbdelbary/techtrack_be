const mongoose = require("mongoose");

const recomendSchema = new mongoose.Schema(
  {
    Product_ID: {
      //parent ref
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    Recommendation_1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    Recommendation_2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    Recommendation_3: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    Recommendation_4: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    Recommendation_5: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    Recommendation_6: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    Recommendation_7: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    Recommendation_8: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    Recommendation_9: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    Recommendation_10: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { collection: "recommendations" }
);

// recomendSchema.pre(/^find/, function (next) {
//   this.populate(Recommendation_1);
//   next();
// });

const Recommendation = mongoose.model(
  "Recommendation",
  recomendSchema,
  "recommendations"
);
module.exports = Recommendation;
