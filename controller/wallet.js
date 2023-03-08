const Wallet = require("../models/Wallet");
const Product = require("../models/Product");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const {ObjectId} = require("mongodb")
const { noCache } = require("helmet");

exports.getWallets = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Wallet.find(req.query));

  const Wallets = await Wallet.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: Wallets,
    pagination,
  });
});

exports.getWalletProducts = asyncHandler(async (req, res, next) => {
  

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);


  const Wallets = await Wallet.findOne({_id: req.params.id})

  const products = await Product.find({_id: {$in: Wallets.products}})
  res.status(200).json({
    success: true,
    data: Wallets,
    products,
  });
});

exports.getWallet = asyncHandler(async (req, res, next) => {

  const Wallet = await Wallet.findById(req.params.id).populate("products");

  if (!Wallet) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: Wallet,
  });
});

exports.createWallet = asyncHandler(async (req, res, next) => {
  const Wallet = await Wallet.create(req.body);

  res.status(200).json({
    success: true,
    data: Wallet,
  });
});

exports.updateWallet = asyncHandler(async (req, res, next) => {
  const Wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!Wallet) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
  }

  res.status(200).json({
    success: true,
    data: Wallet,
  });
});

exports.deleteWallet = asyncHandler(async (req, res, next) => {
  const Wallet = await Wallet.findById(req.params.id);

  if (!Wallet) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
  }

  Wallet.remove();

  res.status(200).json({
    success: true,
    data: Wallet,
  });
});
