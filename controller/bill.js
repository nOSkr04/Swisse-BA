const Bill = require("../models/Bill");
const Product = require("../models/Product");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const {ObjectId} = require("mongodb")
const { noCache } = require("helmet");

exports.getBills = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Bill.find(req.query));

  const bills = await Bill.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: bills,
    pagination,
  });
});

exports.getBillProducts = asyncHandler(async (req, res, next) => {
  

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);


  const bills = await Bill.findOne({_id: req.params.id})

  const products = await Product.find({_id: {$in: bills.products}})
  res.status(200).json({
    success: true,
    data: bills,
    products,
  });
});

exports.getBill = asyncHandler(async (req, res, next) => {

  const bill = await Bill.findById(req.params.id).populate("products");

  if (!bill) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүй!", 400);
  }

  res.status(200).json({
    success: true,
    data: bill,
  });
});

exports.createBill = asyncHandler(async (req, res, next) => {
  const bill = await Bill.create(req.body);

  res.status(200).json({
    success: true,
    data: bill,
  });
});

exports.updateBill = asyncHandler(async (req, res, next) => {
  const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bill) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
  }

  res.status(200).json({
    success: true,
    data: bill,
  });
});

exports.deleteBill = asyncHandler(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);

  if (!bill) {
    throw new MyError(req.params.id + " ID-тэй категори байхгүйээээ.", 400);
  }

  bill.remove();

  res.status(200).json({
    success: true,
    data: bill,
  });
});
