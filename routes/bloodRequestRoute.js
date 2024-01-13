const express = require("express");

const router = express.Router();

const { protect, admin } = require("../middlewares/authMiddleware");
const { saveBloodRequest, getBloodRequests, closeBloodRequest } = require("../controllers/bloodRequestController");

router.route("/new").post(protect, saveBloodRequest);
router.route("/get").get(getBloodRequests);
router.route("/close").get(closeBloodRequest)




module.exports = router;


// letslegalise