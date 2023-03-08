const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  getBills,
  getBill,
  createBill,
  getBillProducts,
  updateBill,
  deleteBill,
} = require("../controller/bill");

// api/v1/bills/:id/Products
// const { getBillProducts } = require("../controller/Products");
// router.route("/:billId/Products").get(getBillProducts);

//"/api/v1/bills"
router.route("/").get(getBills).post(createBill);

router
  .route("/:id")
  .get(getBill)
  .put(protect, authorize("admin", "operator"), updateBill)
  .delete(protect, authorize("admin"), deleteBill);
  
router.route("/:id/product").get(getBillProducts)
module.exports = router;
