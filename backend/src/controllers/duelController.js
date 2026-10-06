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
    expiresAt.setHours(expiresAt.getHours() + parseInt(durationHours));

    let media = [];
    if (req.files && req.files.length > 0) {
      media = req.files.map(file => `/uploads/${file.filename}`);
    }

    const duel = await Duel.create({
      topic,
      description,
      challenger: req.user._id,
      challenged: challengedId,
      challengerSubmission: { content, media, votes: [] },
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
            title: "New Duel Challenge!",
            message: `${req.user.fullName} challenged you to an Industry Duel: "${topic}". Click to accept or decline.`,
            link: `/battles`,
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
    const { content } = req.body;
    const duel = await Duel.findById(req.params.id);

    if (!duel) return res.status(404).json({ message: "Duel not found" });
    if (duel.challenged.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let media = [];
    if (req.files && req.files.length > 0) {
      media = req.files.map(file => `/uploads/${file.filename}`);
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

    const userIdStr = (req.user._id || req.user.id).toString();

    // Check if already voted safely
    const challengerVotes = (duel.challengerSubmission?.votes || []).map((v) => v.toString());
    const challengedVotes = (duel.challengedSubmission?.votes || []).map((v) => v.toString());

    if (challengerVotes.includes(userIdStr) || challengedVotes.includes(userIdStr)) {
      return res.status(400).json({ success: false, message: "Already voted in this duel" });
    }

    if (!duel.challengerSubmission) duel.challengerSubmission = { votes: [] };
    if (!duel.challengedSubmission) duel.challengedSubmission = { votes: [] };
    if (!Array.isArray(duel.challengerSubmission.votes)) duel.challengerSubmission.votes = [];
    if (!Array.isArray(duel.challengedSubmission.votes)) duel.challengedSubmission.votes = [];

    if (side === "challenger") {
      duel.challengerSubmission.votes.push(req.user._id);
    } else {
      duel.challengedSubmission.votes.push(req.user._id);
    }

    await duel.save();

    const updated = await Duel.findById(duel._id)
      .populate("challenger", "username fullName avatarUrl")
      .populate("challenged", "username fullName avatarUrl")
      .populate("winner", "username fullName avatarUrl");

    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

/**
 * List duels by category and status
 */
exports.listDuels = async (req, res, next) => {
  try {
    const { category, status = "active" } = req.query;
    const userId = req.user?._id;

    // Auto-seed sample duels if table is completely empty
    const totalCount = await Duel.countDocuments();
    if (totalCount === 0) {
      try {
        const User = require("../models/User");
        const users = await User.find().limit(2);
        if (users.length >= 2) {
          await Duel.create([
            {
              topic: "Minimalist UI vs Data-Dense Dashboards",
              description: "For high-scale B2B SaaS in 2026, which architectural interface delivers better operational retention?",
              category: "Design",
              challenger: users[0]._id,
              challenged: users[1]._id,
              challengerSubmission: {
                content: "Clean, distraction-free workspaces lower cognitive fatigue and guide decision-makers to key actions faster.",
                media: [],
                votes: []
              },
              challengedSubmission: {
                content: "Power users demand immediate density, cross-metric correlations, and zero nested clicks to complete operations.",
                media: [],
                votes: []
              },
              status: "active",
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            {
              topic: "Autonomous AI Agents vs Human Outbound Sales",
              description: "Will Autonomous AI outbound agents replace human SDRs in B2B enterprise pipeline generation?",
              category: "Sales & Tech",
              challenger: users[1]._id,
              challenged: users[0]._id,
              challengerSubmission: {
                content: "Autonomous AI agents research prospects, craft personalized multi-channel pitches, and follow up 24/7 at 1/10th the cost with zero burnout.",
                media: [],
                votes: []
              },
              challengedSubmission: {
                content: "High-ticket enterprise deals require emotional quotient, trust building, and navigating internal politics that AI cannot replicate.",
                media: [],
                votes: []
              },
              status: "active",
              expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            }
          ]);
        }
      } catch (seedErr) {
        console.warn("Duel auto-seed skipped:", seedErr.message);
      }
    }

    let query = {};

    if (status === "all" && userId) {
      query = {
        $or: [
          { status: "active" },
          { challenger: userId },
          { challenged: userId }
        ]
      };
    } else if (status === "completed") {
      query = { status: "completed" };
    } else if (status === "pending" && userId) {
      query = { 
        status: "pending", 
        $or: [
          { challenger: userId },
          { challenged: userId }
        ]
      };
    } else if (status === "active") {
        query = { status: "active" };
    } else {
        // Fallback for default "active" or specific filter
        query = { status };
    }

    if (category && category !== "All") {
       query.category = category;
    }

    const duels = await Duel.find(query)
      .populate("challenger", "username fullName avatarUrl")
      .populate("challenged", "username fullName avatarUrl")
      .populate("winner", "username fullName avatarUrl")
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: duels });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single duel by ID
 */
exports.getDuelById = async (req, res, next) => {
  try {
    const duel = await Duel.findById(req.params.id)
      .populate("challenger", "username fullName avatarUrl")
      .populate("challenged", "username fullName avatarUrl");
    
    if (!duel) return res.status(404).json({ message: "Duel not found" });
    
    res.json({ success: true, data: duel });
  } catch (error) {
    next(error);
  }
};

/**
 * Finalize a duel (Calculate winner when expired)
 */
exports.finalizeDuel = async (req, res, next) => {
    try {
        const duel = await Duel.findById(req.params.id);
        if (!duel) return res.status(404).json({ message: "Duel not found" });
        
        if (duel.status !== "active") {
            return res.status(400).json({ message: "Duel is not in active state" });
        }

        const challengerVotes = duel.challengerSubmission.votes.length;
        const challengedVotes = duel.challengedSubmission.votes.length;

        if (challengerVotes > challengedVotes) {
            duel.winner = duel.challenger;
        } else if (challengedVotes > challengerVotes) {
            duel.winner = duel.challenged;
        } else {
            // Tie - we can leave winner null or handle specifically
            duel.winner = null; 
        }

        duel.status = "completed";
        await duel.save();

        // Notify participants
        const io = req.app.get("io");
        if (io) {
            io.emit("duel:completed", duel);
        }

        res.json({ success: true, data: duel });
    } catch (error) {
        next(error);
    }
};
