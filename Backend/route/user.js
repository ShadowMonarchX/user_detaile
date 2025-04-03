const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // If the email exists, send a 400 Bad Request with a custom error message
      return res.status(400).json({
        message: "Email already exists. Please choose a different email.",
      });
    }

    // If the email doesn't exist, hash the password and create a new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
    });

    const result = await user.save();
    res.status(201).json({
      message: "User created successfully!",
      user: result,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({
        message: "Authentication failed. Invalid email or password.",
      });
    }
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) {
      return res.status(401).json({
        message: "Authentication failed. Invalid email or password.",
      });
    }
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      "secret_this_should_be_longer",
      { expiresIn: "1h" },
    );
    return res.status(200).json({
      email: user.email,
      token: token,
      expiresIn: 3600,
      userId: user._id,
      status: 200,
      message: "User logged in successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
    });
  }
});

module.exports = router;
