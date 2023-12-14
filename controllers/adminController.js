const asyncHandler = require("express-async-handler");
const generateToken = require("../modules/token");
const Admin = require("../models/admin");

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password, phone } = req.body;
  const user = await Admin.findOne({ email })  || await Admin.findOne({ phone });
  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      token: generateToken(user._id),
      user,
      success: true,
      error: "",
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const addAdmin = asyncHandler(async (req, res) => {
  const { fullname, email, password, phone } = req.body;
  const userExists = await Admin.findOne({ email }) || await Admin.findOne({ phone });
  if (userExists) {
    return res.status(400).json({
      success: false,
      error: "Admin already exists",
    });
  }
  const user = await Admin.create({
    fullname,
    email,
    password,
    phone
  });

  if (user) {
    res.status(201).json({
      success: true,
      error: "",
      user,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await Admin.find({});
  res.json(users);
});


module.exports = {
  login,
  addAdmin,
  getUsers,
};