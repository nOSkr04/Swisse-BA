const Product = require("../models/Product");
const path = require("path");
const Category = require("../models/Category");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/User");
const sharp = require("sharp");
const axios = require("axios");
const Bill = require("../models/Bill");
// api/v1/products
exports.getProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Product);

  const products = await Product.find(req.query, select)
    .populate({
      path: "category",
      select: "title averagePrice",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
    pagination,
  });
});

exports.getUserProducts = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getProducts(req, res, next);
});

// api/v1/categories/:catId/products
exports.getCategoryProducts = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Product);

  //req.query, select
  const products = await Product.find(
    { ...req.query, category: req.params.categoryId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
    pagination,
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }
  if (product.count == null) {
    // default data
    const beginCount = new Product({
      count: 1,
    });
    beginCount.save();
  } else {
    product.count += 1;
    product.save();
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(200).json({
    success: true,
    data: category,
  });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    throw new MyError(req.body.category + " ID-тэй категори байхгүй!", 400);
  }

  req.body.createUser = req.userId;
  console.log(req.body);
  const product = await Product.create(req.body);

  res.status(200).json({
    success: true,
    data: product,
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    product.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  product.remove();

  res.status(200).json({
    success: true,
    data: product,
    whoDeleted: user.name,
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    product.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    product[attr] = req.body[attr];
  }

  product.save();

  res.status(200).json({
    success: true,
    data: product,
  });
});

// PUT:  api/v1/products/:id/upload-thumbnail

exports.uploadProductThumbnail = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // image upload
  const file = req.files.file;
  file.name = `thumbnail_${req.params.id}_image1${path.parse(file.name).ext}`;

  const picture = await sharp(file.data).toFile(
    `${process.env.FILE_UPLOAD_PATH}/${file.name}`
  );
  product.thumbnail = file.name;
  product.save();
  res.status(200).json({
    success: true,
    data: product.thumbnail,
  });
});
// PUT:  api/v1/products/:id/upload-images
exports.uploadProductImages = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // image upload
  if (req.files.file != undefined) {
    const file = req.files.file;
    file.name = `image_${req.params.id}_image${path.parse(file1.name).ext}`;

    const picture = await sharp(file.data).toFile(
      `${process.env.FILE_UPLOAD_PATH}/${file1.name}`
    );
    product.images.image = file.name;
  }
  if (req.files.file1 != undefined) {
    const file1 = req.files.file1;
    file1.name = `image_${req.params.id}_image1${path.parse(file1.name).ext}`;

    const picture = await sharp(file1.data).toFile(
      `${process.env.FILE_UPLOAD_PATH}/${file1.name}`
    );
    product.images.image1 = file1.name;
  }
  if (req.files.file2 != undefined) {
    const file2 = req.files.file2;

    file2.name = `image_${req.params.id}_image2${path.parse(file2.name).ext}`;

    const picture = await sharp(file2.data).toFile(
      `${process.env.FILE_UPLOAD_PATH}/${file2.name}`
    );

    product.images.image2 = file2.name;
  }
  if (req.files.file3 != undefined) {
    const file3 = req.files.file3;

    file3.name = `image_${req.params.id}_image3${path.parse(file3.name).ext}`;

    const picture = await sharp(file3.data).toFile(
      `${process.env.FILE_UPLOAD_PATH}/${file3.name}`
    );

    product.images.image3 = file3.name;
  }
  if (req.files.file4 != undefined) {
    const file4 = req.files.file4;

    file4.name = `image_${req.params.id}_image4${path.parse(file4.name).ext}`;

    const picture = await sharp(file4.data).toFile(
      `${process.env.FILE_UPLOAD_PATH}/${file4.name}`
    );

    product.images.image4 = file4.name;
  }
  product.save();

  res.status(200).json({
    success: true,
    data: product.images,
  });
});

exports.invoiceTime = asyncHandler(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);
  await axios({
    method: "post",
    url: "https://merchant.qpay.mn/v2/auth/token",
    headers: {
      Authorization: `Basic QUxUQU5aQUFOOkxKNkZnblNn=`,
    },
  })
    .then((response) => {
      const token = response.data.access_token;
      axios({
        method: "post",
        url: "https://merchant.qpay.mn/v2/invoice",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          invoice_code: "ALTANZAAN_INVOICE",
          sender_invoice_no: "12345678",
          invoice_receiver_code: `${bill._id}`,
          invoice_description: `${bill._id}`,
          amount: req.body.amount,
          callback_url: `https://altanzaan.org/api/v1/products/callbacks/${req.params.id}/${req.body.amount}`,
        },
      })
        .then(async (response) => {
          bill.qrImage = response.data.qr_image;
          bill.invoiceId = response.data.invoice_id
          bill.save();
          res.status(200).json({
            success: true,
            data: bill,
          });
        })
        .catch((error) => {
          console.log(error.response.data, "error");
        });
    })
    .catch((error) => {
      console.log(error.response.data);
    });
});
exports.chargeTime = asyncHandler(async (req, res, next) => {
  const bill = await Bill.findById(req.params.id);
  bill.isPayed = "Төлөгдсөн";
  bill.save();
  res.status(200).json({
    success: true,
    data: bill,
  });
});
exports.invoiceCheck = asyncHandler(async(req,res) => {
  
  await axios({
    method: "post",
    url: "https://merchant.qpay.mn/v2/auth/token",
    headers: {
      Authorization: `Basic QUxUQU5aQUFOOkxKNkZnblNn=`,
    },
  })
    .then((response) => {
      const token = response.data.access_token;
      axios({
        method: "post",
        url: "https://merchant.qpay.mn/v2/payment/check",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          object_type: "INVOICE",
          object_id: req.params.id,
          page_number:1,
          page_limit: 100,
          callback_url: `https://altanzaan.org/api/v1/products/check/challbacks/${req.params.id}`,
        },
      })
        .then(async (response) => {
          const checks = response.count
          console.log(checks);
          const bill = await Bill.findById(req.params.id);
         if(response.data.count !== 0){
          bill.isPayed = "Төлөгдсөн";
          bill.save();
         }
        })
        .catch((error) => {
          console.log(error.response.data, "error");
        });
    })
    .catch((error) => {
      console.log(error.response.data);
    });
})
