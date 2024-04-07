const express = require("express");

const router = express.Router();


const { protect, admin } = require("../middlewares/authMiddleware");
const { getAllinfo, getUsersByBloodGroup, getBloodDonationData } = require("../controllers/infoController");
const { getInsights } = require("../utils/insightsalgo");


router.get("/all", getAllinfo);
router.get("/bg-users", getUsersByBloodGroup)
router.get("/graph", getBloodDonationData)
router.get("/insights/:id", getInsights)


module.exports = router;