const express = require("express");

const router = express.Router();

const { protect, admin } = require("../middlewares/authMiddleware");
const { saveBloodRequest, getBloodRequests } = require("../controllers/bloodRequestController");

router.route("/new").post(protect, saveBloodRequest);
router.route("/get").get(getBloodRequests);



module.exports = router;


// letslegalise