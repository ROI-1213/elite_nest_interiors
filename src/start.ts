import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next, request }: any) => {
  try {
    return await next();
  } catch (error: any) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error("[TanStack Start Error]:", error?.message || error);

    // If client requested JSON or is calling an API / server function, return JSON error
    const accept = request?.headers?.get?.("accept") || "";
    const isHtml = accept.includes("text/html");
    if (!isHtml) {
      return new Response(
        JSON.stringify({
          success: false,
          error: error?.message || "Internal Server Error",
        }),
        {
          status: 500,
          headers: { "content-type": "application/json" },
        }
      );
    }

    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware],
}));
