const express = require("express");

const router = express.Router();
const {
  login,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  renewToken,
  getUserAddress,
} = require("../controllers/authController");

const { protect, admin } = require("../middlewares/authMiddleware");

router.route("/").post(registerUser);

router.put("/update-notification-token", protect, updateUser);

router.post("/login", login);

router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .post(protect, updateUser);

router.post("/renew-token", protect, renewToken);
router.get("/get-addresses", protect, getUserAddress);

module.exports = router;