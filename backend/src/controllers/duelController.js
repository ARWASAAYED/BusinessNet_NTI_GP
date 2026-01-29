const Duel = require("../models/duel");
const User = require("../models/user");

/**
 * Start a new duel challenge
 */
exports.createDuel = async (req, res, next) => {
  try {
    const { topic, description, challengedId, category, content, durationHours = 24 } = req.body;

    if (!challengedId || !topic || !category) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationHours);

    const duel = await Duel.create({
      topic,
      description,
      challenger: req.user._id,
      challenged: challengedId,
      challengerSubmission: { content, votes: [] },
      category,
      expiresAt,
      status: "pending"
    });

    // Create notification for the challenged user
    try {
        const Notification = require("../models/notification");
        const notification = await Notification.create({
            userId: challengedId,
            sender: req.user._id,
            type: "social",
            title: "New Duel Challenge",
            message: `${req.user.fullName} has challenged you to an Industry Duel: ${topic}`,
            link: `/profile/${req.user._id}`,
            referenceId: duel._id,
        });

        const io = req.app.get("io");
        if (io) {
            io.to(challengedId.toString()).emit("notification", notification);
        }
    } catch (notifier) {
        console.error("Failed to send duel notification:", notifier);
    }

    res.status(201).json({ success: true, data: duel });
  } catch (error) {
    next(error);
  }
};

/**
 * Accept a duel and provide initial submission
 */
exports.acceptDuel = async (req, res, next) => {
  try {
    const { content, media } = req.body;
    const duel = await Duel.findById(req.params.id);

    if (!duel) return res.status(404).json({ message: "Duel not found" });
    if (duel.challenged.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    duel.challengedSubmission = { content, media, votes: [] };
    duel.status = "active";
    await duel.save();

    const updatedDuel = await Duel.findById(duel._id)
      .populate("challenger", "username fullName avatarUrl")
      .populate("challenged", "username fullName avatarUrl");

    res.json({ success: true, data: updatedDuel });
  } catch (error) {
    next(error);
  }
};

/**
 * Vote for a participant in a duel
 */
exports.voteInDuel = async (req, res, next) => {
  try {
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid Duel ID" });
    }
    const { side } = req.body; // 'challenger' or 'challenged'
    const duel = await Duel.findById(req.params.id);

    if (!duel || duel.status !== "active") {
      return res.status(400).json({ message: "Duel is not active" });
    }

    const userId = req.user._id;

    // Check if already voted
    const hasVoted = duel.challengerSubmission.votes.includes(userId) || 
                     duel.challengedSubmission.votes.includes(userId);

    if (hasVoted) {
      return res.status(400).json({ message: "Already voted in this duel" });
    }

    if (side === "challenger") {
      duel.challengerSubmission.votes.push(userId);
    } else {
      duel.challengedSubmission.votes.push(userId);
    }

    await duel.save();
    res.json({ success: true, data: duel });
  } catch (error) {
    next(error);
  }
};

/**
 * List active duels by category
 */
exports.listDuels = async (req, res, next) => {
  try {
    const { category } = req.query;
    const userId = req.user?._id;

    // Build query: Active duels (global) OR Pending duels involving me
    const query = {
      $or: [
        { status: "active" },
        ...(userId ? [{ 
          status: "pending", 
          $or: [
            { challenger: userId },
            { challenged: userId }
          ]
        }] : [])
      ]
    };

    if (category && category !== "All") {
       // Apply category filter to the active duels mainly, 
       // but for simplicity we wrap the whole thing or add it to both sides of the $or
       query.category = category;
    }

    const duels = await Duel.find(query)
      .populate("challenger", "username fullName avatarUrl")
      .populate("challenged", "username fullName avatarUrl")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: duels });
  } catch (error) {
    next(error);
  }
};
