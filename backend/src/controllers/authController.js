const User = require("../models/user");
const Business = require("../models/business");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    // Self-healing: if it's a business user but businessId is missing, find and link it
    if (user.role === 'business' && !user.businessId) {
      const business = await Business.findOne({ userId: user._id });
      if (business) {
        user.businessId = business._id;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          id: user._id,
          username: user.username,
          email: user.email,
          accountType: user.role === "business" ? "business" : "personal",
          role: user.role,
          avatar: user.avatarUrl,
          fullName: user.fullName,
          businessId: user.businessId,
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.signup = async (req, res) => {
  try {
    const { fullName, username, email, password, role, category } = req.body;

    // Check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userData = {
      fullName,
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      accountType: role === "business" ? "business" : "personal",
    };

    if (req.files && req.files.length > 0) {
      userData.avatarUrl = `/uploads/${req.files[0].filename}`;
    }

    const user = await User.create(userData);
    let businessId = null;

    // If registering as business, create Business record and link it
    if (role === "business") {
      const business = await Business.create({
        userId: user._id,
        name: fullName || username,
        type: "individual",
        industry: "Services",
        avatarUrl: userData.avatarUrl,
        category: category || "Services",
      });
      
      businessId = business._id;
      user.businessId = businessId;
      await user.save();
    }

    // Generate token after registration
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          id: user._id,
          username: user.username,
          email: user.email,
          accountType: user.role === "business" ? "business" : "personal",
          role: user.role,
          avatar: user.avatarUrl,
          fullName: user.fullName,
          businessId: businessId,
        },
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
