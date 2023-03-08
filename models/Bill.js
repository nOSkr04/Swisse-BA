const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const BillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    isPayed: {
      enum: ["Төлөгдсөн", "Төлөгдөөгүй", "Хүргэгдсэн"],
      type: String,
      default: "Төлөгдөөгүй",
    },
    products: [
      {
        price: Number,
        quantity: Number,
        thumbnail: String,
        title: String,
      },
    ],
    district: {
      type: String,
    },
    apartmentNumber: {
      type: String,
    },
    floor: {
      type: String,
    },
    houseCode: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    locationDetail: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    qrImage: {
      type: String,
      default: null,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Bill", BillSchema);
