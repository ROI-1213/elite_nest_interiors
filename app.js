// Entry point for cPanel / PM2 / Passenger / Node.js application
import http from "node:http";

async function bootstrap() {
  const entry = await import("./.output/server/index.mjs");
  const handler = entry.default;

  if (handler && typeof handler.fetch === "function") {
    const server = http.createServer(async (req, res) => {
      try {
        const host = req.headers.host || "localhost";
        const protocol = req.headers["x-forwarded-proto"] || "http";
        const url = new URL(req.url, `${protocol}://${host}`);

        const headers = new Headers();
        for (const [k, v] of Object.entries(req.headers)) {
          if (v) headers.set(k, Array.isArray(v) ? v.join(", ") : v);
        }

        const init = {
          method: req.method,
          headers,
        };

        if (req.method !== "GET" && req.method !== "HEAD") {
          const chunks = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          init.body = Buffer.concat(chunks);
        }

        const request = new Request(url.href, init);
        const waitUntil = () => {};
        const ctx = {
          waitUntil,
          passThroughOnException: () => {},
          context: {
            waitUntil,
            passThroughOnException: () => {},
          },
        };

        const response = await handler.fetch(request, {}, ctx);

        res.statusCode = response.status;
        for (const [k, v] of response.headers.entries()) {
          res.setHeader(k, v);
        }

        const buffer = Buffer.from(await response.arrayBuffer());
        res.end(buffer);
      } catch (err) {
        console.error("[HTTP Server Error]:", err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    });

    const port = Number(process.env.PORT) || 3000;
    server.listen(port, () => {
      console.log(`[Elite Nest] Production server running at http://localhost:${port}`);
    });
  } else {
    console.error("[Startup error]: .output/server/index.mjs did not export a fetch handler.");
  }
}

bootstrap().catch((err) => {
  console.error("[Startup error]: Failed to launch server:", err);
  process.exit(1);
});
