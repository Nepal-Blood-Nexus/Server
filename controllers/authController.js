const asyncHandler = require("express-async-handler");
const generateToken = require("../modules/token");
const User = require("../models/user");

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password, phone } = req.body;
  const user = await User.findOne({ email })  || await User.findOne({ phone });
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
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, phone } = req.body;
  const userExists = await User.findOne({ email }) || await User.findOne({ phone });
  if (userExists) {
    return res.status(400).json({
      success: false,
      error: "User already exists",
    });
  }
  const user = await User.create({
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
  const users = await User.find({});
  res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const step = req.query.step;

  if (user) {
    if(step==1){
      const _profile = {blood_group,bp,age,weight} = req.body;
      user.profile.push(_profile);
      const _updatedUser = await user.save();
      return res.status(201).json({
      success: true,
      error: "",
      user: _updatedUser,
      token: generateToken(_updatedUser._id),
    });

      
    }
   
    
    // const _updatedUser = await user.save();
    // return res.status(201).json({
    //   success: true,
    //   error: "",
    //   user: _updatedUser,
    //   token: generateToken(_updatedUser._id),
    // });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const renewToken = asyncHandler(async (req, res) => {
  const UserRequested = req.user;
  const token = generateToken(UserRequested._id);
  return res.json({
    success: true,
    error: "",
    token,
    user: UserRequested || {},
  });
});

const getUserAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    return res.json({
      resp: true,
      msg: "",
      listAddresses: user.address,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  login,
  registerUser,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  renewToken,
  getUserAddress,
};