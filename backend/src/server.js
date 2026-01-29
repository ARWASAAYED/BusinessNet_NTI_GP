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

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://192.168.8.155:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Make io accessible in routes
app.set("io", io);

connectDB();
// Allow cross-origin embedding for static uploads (images/videos)
// Helmet's default Cross-Origin-Resource-Policy can block cross-origin embedding — set policy to 'cross-origin'
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3000",
      "http://192.168.8.155:3000",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(morgan("dev"));
app.use(requestIdMiddleware);
app.use(activityLoggerMiddleware);
app.use(rateLimitMiddleware(500, 60));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Trendverse API is running",
    timestamp: new Date(),
  });
});
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API Route not found",
  });
});
app.use(errorMiddleware);

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
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
    console.log("Client disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(
    `Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port http://localhost:${PORT}`
  );
});
