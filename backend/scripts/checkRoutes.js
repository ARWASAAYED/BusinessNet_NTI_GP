const router = require("../src/routers/routes");

console.log("Router loaded. Listing routes...");

if (router && router.stack) {
  router.stack.forEach((layer, index) => {
    const route =
      layer.route && layer.route.path ? layer.route.path : "<middleware>";
    const methods =
      layer.route && layer.route.methods
        ? Object.keys(layer.route.methods).join(",")
        : "";
    const handleType = layer.route
      ? layer.route.stack &&
        layer.route.stack[0] &&
        typeof layer.route.stack[0].handle
      : typeof layer.handle;
    console.log(
      `${index}: ${route} [${methods}] -> handler type: ${handleType}`
    );
  });
} else {
  console.log("No stack found on router");
}
