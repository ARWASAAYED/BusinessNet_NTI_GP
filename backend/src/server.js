require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const connectDB = require("./config/db");
const activityLoggerMiddleware = require("./middleware/activityLoggerMiddleware");
const errorMiddleware = require("./middleware/errorMiddleware");
const requestIdMiddleware = require("./middleware/requestIdMiddleware");
const rateLimitMiddleware = require("./middleware/rateLimitMiddleware");
const routes = require("./routers/routes");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// ─── CORS Configuration ──────────────────────────────────────────────────────
const staticAllowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://192.168.8.155:3000",
    ];

const isAllowedOrigin = (origin) => {
  if (!origin) return true; // curl, Postman, mobile apps
  if (origin.endsWith(".vercel.app")) return true;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:[0-9]+)?$/.test(origin)) return true;
  if (staticAllowedOrigins.includes(origin)) return true;
  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Range",
  ],
  exposedHeaders: [
    "Content-Range",
    "Accept-Ranges",
    "Content-Length",
    "Content-Type",
  ],
  maxAge: 86400,
  optionsSuccessStatus: 200,
};

// ─── CRITICAL: CORS MUST BE FIRST ────────────────────────────────────────────
// Register CORS before every other middleware so that ALL responses
// (including errors from DB or other middleware) carry CORS headers.
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // handle preflight for all routes (Express 5 compatible)

// ─── Socket.IO ───────────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
app.set("io", io);
app.set("server", server);
app.server = server;

// ─── Security & Parsing ──────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(requestIdMiddleware);
app.use(activityLoggerMiddleware);
app.use(rateLimitMiddleware(500, 60));

// ─── Health check (responds immediately, even during cold starts) ─────────
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BusinessNet API is running",
    version: "2.0.0-gridfs",
    timestamp: new Date(),
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date(),
  });
});

// ─── DB Connection (after CORS so errors have CORS headers) ──────────────────
// Warm up DB at cold start
connectDB().catch((err) =>
  console.error("Initial DB connect failed:", err.message),
);

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB connection error:", err.message);
    // CORS headers are already set by the cors() middleware above,
    // so this 503 response will include them correctly.
    return res.status(503).json({
      success: false,
      message: "Database unavailable. Please try again in a moment.",
      error: err.message,
    });
  }
});

// ─── Static Uploads ──────────────────────────────────────────────────────────
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/v1", routes);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route not found",
  });
});

app.use(errorMiddleware);

// ─── Socket.IO Events ────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.data.userId = String(userId);
    socket.join(String(userId));
    io.emit("user_status", { userId: String(userId), isOnline: true });
    console.log(`User ${userId} joined their private room`);
  });

  socket.on("join_community", (communityId) => {
    socket.join(`community_${communityId}`);
    console.log(`Socket ${socket.id} joined community ${communityId}`);
  });

  socket.on("leave_community", (communityId) => {
    socket.leave(`community_${communityId}`);
    console.log(`Socket ${socket.id} left community ${communityId}`);
  });

  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    if (userId) {
      io.emit("user_status", { userId, isOnline: false });
    }
    console.log("Client disconnected:", socket.id);
  });
});

// ─── Start Server (non-Vercel / direct execution only) ──────────────────────
if (
  process.env.VERCEL !== "1" &&
  !process.env.VERCEL_ENV &&
  require.main === module
) {
  server.listen(PORT, () => {
    console.log(
      `Server running in ${
        process.env.NODE_ENV || "development"
      } mode on port http://localhost:${PORT}`,
    );
  });
}

module.exports = app;
