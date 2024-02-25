const express = require("express");

const router = express.Router();
const {
  login,
  addAdmin,
} = require("../controllers/adminController");

const { protect, admin } = require("../middlewares/authMiddleware");
const { intializeChat, getMyChats, sendMessage } = require("../controllers/chatController");


router.post("/initialize",protect, intializeChat);
router.post("/send",protect, sendMessage);
router.get("/getmychats",protect, getMyChats);




module.exports = router;