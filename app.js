// Entry point for cPanel / PM2 / Passenger Node.js application
import('./.output/server/index.mjs').catch((err) => {
  console.error('[Startup error]: Failed to launch .output/server/index.mjs:', err);
  process.exit(1);
});
