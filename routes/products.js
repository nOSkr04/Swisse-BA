const express = require("express");
const { protect, authorize } = require("../middleware/protect");

const {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
  uploadProductThumbnail,
  uploadProductImages,
} = require("../controller/products");


const router = express.Router();

//"/api/v1/products"
router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin", "operator"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .delete(protect, authorize("admin", "operator"), deleteProduct)
  .put(protect, authorize("admin", "operator"), updateProduct);

router
  .route("/:id/upload-thumbnail")
  .put(uploadProductThumbnail);
router
  .route("/:id/upload-images")
  .put(uploadProductImages);


module.exports = router;
