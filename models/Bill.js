const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const BillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    isTologdson: {
      enum: ["payed", "paying", "hurgegdsen"],
      type: String,
    },
    products: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    invoiceId:{
      type: String
    },
    qrImage:{
      type:String
    },
    urls:[{
      name:String,
      description: String,
      logo: String,
      link: String
    }]
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Bill", BillSchema);
