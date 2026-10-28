// Entry point for cPanel / PM2 / Passenger / Node.js application
process.env.NODE_ENV = process.env.NODE_ENV || "production";

// Start the production Nitro node-server
import("./.output/server/index.mjs")
  .then(() => {
    console.log("[Elite Nest] Production server initialized successfully.");
  })
  .catch((err) => {
    console.error("[Startup error]: Failed to launch server:", err);
    process.exit(1);
  });
