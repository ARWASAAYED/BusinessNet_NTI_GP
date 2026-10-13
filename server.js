const app = require("./backend/src/server");

// If executed directly (e.g. node server.js or npm start on Render/Railway/Heroku/local)
if (
  process.env.VERCEL !== "1" &&
  !process.env.VERCEL_ENV &&
  require.main === module
) {
  const server = app.get("server") || app.server;
  const PORT = process.env.PORT || 5000;
  if (server) {
    server.listen(PORT, () => {
      console.log(
        `BusinessNet Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port http://localhost:${PORT}`,
      );
    });
  } else {
    app.listen(PORT, () => {
      console.log(
        `BusinessNet Server running in ${
          process.env.NODE_ENV || "development"
        } mode on port http://localhost:${PORT}`,
      );
    });
  }
}

module.exports = app;
