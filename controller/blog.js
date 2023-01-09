const Blog = require("../models/Blog");
const path = require("path");
const MyError = require("../utils/myError");
const asyncHandler = require("express-async-handler");
const paginate = require("../utils/paginate");
const User = require("../models/User");
const sharp = require("sharp");
// api/v1/blogs
exports.getBlogs = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  [("select", "sort", "page", "limit")].forEach((el) => delete req.query[el]);

  const pagination = await paginate(page, limit, Blog);

  const blogs = await Blog.find(req.query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: blogs.length,
    data: blogs,
    pagination,
  });
});

exports.getUserBlogs = asyncHandler(async (req, res, next) => {
  req.query.createUser = req.userId;
  return this.getBlogs(req, res, next);
});



exports.getBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }
  if (blog.count == null) {
    // default data
    const beginCount = new Blog({
      count: 1,
    });
    beginCount.save();
  } else {
    blog.count += 1;
    blog.save();
  }
  res.status(200).json({
    success: true,
    data: blog,
  });
});



exports.createBlog = asyncHandler(async (req, res, next) => {

  req.body.createUser = req.userId;
console.log(req.body)
  const blog = await Blog.create(req.body);

  res.status(200).json({
    success: true,
    data: blog,
  });
});

exports.deleteBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүй байна.", 404);
  }

  if (
    blog.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  const user = await User.findById(req.userId);

  blog.remove();

  res.status(200).json({
    success: true,
    data: blog,
    whoDeleted: user.name,
  });
});

exports.updateBlog = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);

  if (!blog) {
    throw new MyError(req.params.id + " ID-тэй ном байхгүйээээ.", 400);
  }

  if (
    blog.createUser.toString() !== req.userId &&
    req.userRole !== "admin"
  ) {
    throw new MyError("Та зөвхөн өөрийнхөө номыг л засварлах эрхтэй", 403);
  }

  req.body.updateUser = req.userId;

  for (let attr in req.body) {
    blog[attr] = req.body[attr];
  }

  blog.save();

  res.status(200).json({
    success: true,
    data: blog,
  });
});

// PUT:  api/v1/blogs/:id/upload-thumbnail

exports.uploadBlogThumbnail = asyncHandler(async (req, res, next) => {
  const blog = await Blog.findById(req.params.id);
  // image upload
    const file = req.files.file;
    file.name = `blog_${req.params.id}_image1${path.parse(file.name).ext}`;

    const picture = await sharp(file.data).toFile(
      `${process.env.FILE_UPLOAD_PATH}/${file.name}`
    );
    blog.thumbnail = file.name;
  blog.save();
  res.status(200).json({
    success: true,
    data: blog.thumbnail,
  });
});
