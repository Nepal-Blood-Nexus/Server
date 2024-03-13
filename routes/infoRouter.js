const express = require("express");

const router = express.Router();


const { protect, admin } = require("../middlewares/authMiddleware");
const { getAllinfo } = require("../controllers/infoController");


router.get("/all", getAllinfo);



module.exports = router;