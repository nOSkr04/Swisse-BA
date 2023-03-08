const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/protect");

const {
  getWallets,
  getWallet,
  createWallet,
  getWalletProducts,
  updateWallet,
  deleteWallet,
} = require("../controller/wallet");

// api/v1/wallets/:id/Products
// const { getWalletProducts } = require("../controller/Products");
// router.route("/:walletId/Products").get(getWalletProducts);

//"/api/v1/wallets"
router.route("/").get(getWallets).post(createWallet);

router
  .route("/:id")
  .get(getWallet)
  .put(protect, authorize("admin", "operator"), updateWallet)
  .delete(protect, authorize("admin"), deleteWallet);
  
router.route("/:id/product").get(getWalletProducts)
module.exports = router;
