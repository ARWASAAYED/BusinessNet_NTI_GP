const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "..", ".next");

try {
  fs.rmSync(target, { recursive: true, force: true });
  console.log("Removed stale Next.js .next cache");
} catch (error) {
  console.error("Failed to remove stale Next.js cache:", error.message);
  process.exitCode = 1;
}
