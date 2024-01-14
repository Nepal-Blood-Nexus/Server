const express = require("express");

const router = express.Router();


const { protect, admin } = require("../middlewares/authMiddleware");
const { savePlace, getPlaces, update } = require("../controllers/donationPlaces");

router.route("/save").post(savePlace);
router.route("/update").post(update);


router.get("/all", getPlaces);



module.exports = router;