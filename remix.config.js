/**
 * Minimal remix config suitable for Cloudflare Workers
 */
module.exports = {
  serverBuildTarget: "cloudflare-workers",
  server: "./worker/index.js",
  ignoredRouteFiles: ["**/.*"]
};
