const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
    },
    name: {
      type: String,
    },
    model_name: {
      type: String,
    },
    image_src: {
      type: String,
    },
    price: {
      type: Number,
    },
    sale: {
      type: Number,
    },
    display_size: {
      type: Number,
    },
    ram: {
      type: Number,
    },
    HDD: {
      type: String,
    },
    processor: {
      type: String,
    },
    graphics_card: {
      type: String,
    },
    link_href: {
      type: String,
    },
    operating_system: {
      type: String,
    },
    SSD: {
      type: String,
    },
    site: {
      type: String,
    },
    Rate_Avg: {
      type: Number,
      default: 0,
      min: [1, "Ratings must be above or equal 1.0"],
      max: [5, "Ratings must be below or equal 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    Rate_Qty: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
    },
    internal_memory: {
      type: Number,
    },
    battery: {
      type: Number,
    },
    prim_cam: {
      type: Number,
    },
    second_cam: {
      type: Number,
    },
    SIM_count: {
      type: String,
    },
    network: {
      type: String,
    },
    Accessories_type: {
      type: String,
    },
    Accessories_features: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { collection: "Products" }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});

productSchema.virtual("recommendations", {
  ref: "Recommendation",
  foreignField: "Product_ID",
  localField: "_id",
});

productSchema.index({ category: 1 });

const Product = mongoose.model("Product", productSchema, "Products");
module.exports = Product;
