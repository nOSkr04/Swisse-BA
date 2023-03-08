const mongoose = require("mongoose");
const { slugify } = require("transliteration");

const WalletSchema = new mongoose.Schema(
  {
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

module.exports = mongoose.model("Wallet", WalletSchema);
