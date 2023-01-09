const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    thumbnail: {
      type: String,
      default: "no-photo.jpg",
    },
    shortDescription: {
      type: String,
    },
    description: {
      type: String,
    },
    count:{
      type: Number,
      default: 0,
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


module.exports = mongoose.model("Blog", BlogSchema);
