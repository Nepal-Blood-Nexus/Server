const express = require("express");

const router = express.Router();

const { protect, admin } = require("../middlewares/authMiddleware");
const { saveBloodRequest } = require("../controllers/bloodRequestController");

router.route("/new").post(protect, saveBloodRequest);


module.exports = router;