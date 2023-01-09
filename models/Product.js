const mongoose = require("mongoose");

const ProdcutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    thumbnail: {
      type: String,
      default: "no-photo.jpg",
    },
    images: {
      image: { type: String },
      image1: { type: String },
      image2: { type: String },
      image3: { type: String },
      image4: { type: String },
    },
    price: {
      type: Number,
    },
    stock: Number,
    description: {
      type: String,
    },
    shortDescription: {
      type: String,
    },
    otherInfo: {
      type: String,
    },
    weight: {
      type: String,
    },
    ingredients: {
      type: String,
    },
    subCategory: {
      type: String,
      enum: ["Хүүхэд", "Эрэгтэй", "Эмэгтэй", "Витамин"],
    },
    count:{
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: true,
    },

    createUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    updateUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProdcutSchema.statics.computeCategoryAveragePrice = async function (catId) {
  const obj = await this.aggregate([
    { $match: { category: catId } },
    { $group: { _id: "$category", avgPrice: { $avg: "$price" } } },
  ]);

  console.log(obj);
  let avgPrice = null;

  if (obj.length > 0) avgPrice = obj[0].avgPrice;

  await this.model("Category").findByIdAndUpdate(catId, {
    averagePrice: avgPrice,
  });

  return obj;
};

ProdcutSchema.post("save", function () {
  this.constructor.computeCategoryAveragePrice(this.category);
});

ProdcutSchema.post("remove", function () {
  this.constructor.computeCategoryAveragePrice(this.category);
});

ProdcutSchema.virtual("zohiogch").get(function () {
  // this.author
  if (!this.author) return "";

  let tokens = this.author.split(" ");
  if (tokens.length === 1) tokens = this.author.split(".");
  if (tokens.length === 2) return tokens[1];

  return tokens[0];
});

module.exports = mongoose.model("Product", ProdcutSchema);
