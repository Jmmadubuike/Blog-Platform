const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// User registration
exports.registerUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Check if the email already exists
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user", // Default role is 'user'
    });

    // Save user to the database
    await user.save();

    // Generate a JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token valid for 1 hour
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error during registration" });
  }
};

// User login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h", // Token valid for 1 hour
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Server error during login" });
  }
};

// Get logged-in user profile (protected route)
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching user profile" });
  }
};
