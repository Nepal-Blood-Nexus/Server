const express = require("express");

const router = express.Router();
const {
  login,
  addAdmin,
} = require("../controllers/adminController");

const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/").post(protect,admin,addAdmin);

// router.put("/update-notification-token", protect, updateUser);

router.post("/login", login);

// router
//   .route("/:id")
//   .delete(protect, admin, deleteUser)
//   .get(protect, admin, getUserById)
//   .put(protect, admin, updateUser);

// router.post("/renew-token", protect, renewToken);
// router.get("/get-addresses", protect, getUserAddress);

module.exports = router;