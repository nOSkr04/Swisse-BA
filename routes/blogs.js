const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getBlogs,
  getBlog,
  createBlog,
  deleteBlog,
  updateBlog,
  uploadBlogThumbnail,
} = require("../controller/blog");


const router = express.Router();

//"/api/v1/blogs"
router
  .route("/")
  .get(getBlogs)
  .post(protect, authorize("admin", "operator"), createBlog);

router
  .route("/:id")
  .get(getBlog)
  .delete(protect, authorize("admin", "operator"), deleteBlog)
  .put(protect, authorize("admin", "operator"), updateBlog);

router
  .route("/:id/upload-thumbnail")
  .put(uploadBlogThumbnail);



module.exports = router;
