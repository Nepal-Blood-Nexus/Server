const express = require("express");

const router = express.Router();


const { protect, admin } = require("../middlewares/authMiddleware");
const { getAllinfo, getUsersByBloodGroup } = require("../controllers/infoController");


router.get("/all", getAllinfo);
router.get("/bg-users", getUsersByBloodGroup)



module.exports = router;