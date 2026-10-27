import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { queryOneDb } from "./lib/db";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    // Direct PostgreSQL Storage Endpoint: /api/storage/:bucket/:filename
    if (url.pathname.startsWith("/api/storage/")) {
      const match = url.pathname.match(/^\/api\/storage\/([^/]+)\/(.+)$/);
      if (match) {
        const [, bucket, encodedFilename] = match;
        const filename = decodeURIComponent(encodedFilename);
        try {
          const row = await queryOneDb<{ mime_type: string; file_data: Buffer }>(
            "SELECT mime_type, file_data FROM public.storage_objects WHERE bucket_id = $1 AND filename = $2",
            [bucket, filename]
          );
          if (row && row.file_data) {
            return new Response(new Uint8Array(row.file_data), {
              status: 200,
              headers: {
                "content-type": row.mime_type || "image/jpeg",
                "cache-control": "public, max-age=31536000, immutable",
              },
            });
          }
          return new Response("Not found", { status: 404 });
        } catch (err) {
          console.error("Error serving storage file from PostgreSQL:", err);
          return new Response("Internal Server Error", { status: 500 });
        }
      }
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
