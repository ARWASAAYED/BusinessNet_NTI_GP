const User = require("../models/user");
const bcrypt = require("bcryptjs");

let cachedGuest = null;

const getOrCreateGuestUser = async () => {
  try {
    if (cachedGuest) {
      const existing = await User.findById(cachedGuest._id);
      if (existing) return existing;
    }

    let guest = await User.findOne({ username: "Guest" });
    if (!guest) {
      const hashedPassword = await bcrypt.hash("guest_random_pass_777!", 10);
      guest = await User.create({
        fullName: "Guest User",
        username: "Guest",
        email: "guest@businessnet.local",
        password: hashedPassword,
        role: "guest",
        accountType: "personal",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Guest",
      });
    }
    cachedGuest = guest;
    return guest;
  } catch (error) {
    console.error("Error obtaining guest user:", error);
    // Fallback search by email
    let guest = await User.findOne({ email: "guest@businessnet.local" });
    if (guest) return guest;
    throw error;
  }
};

module.exports = { getOrCreateGuestUser };
