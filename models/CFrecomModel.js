const mongoose = require("mongoose");

const CFrecomendSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    recommend_0: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    recommend_1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    recommend_2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    recommend_3: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    recommend_4: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    recommend_5: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    recommend_6: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    recommend_7: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    recommend_8: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    recommend_9: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { collection: "CF_recom" }
);

const CFRecommendation = mongoose.model(
  "CFRecommendation",
  CFrecomendSchema,
  "CF_recom"
);
module.exports = CFRecommendation;
