import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,             // 5 seconds freshness avoids micro-thrashing on initial hydration while keeping content fresh
        gcTime: 10 * 60_000,         // Keep cache in memory
        retry: 1,
        refetchOnWindowFocus: true,  // Automatically refetch whenever user refocuses tab/browser
        refetchOnMount: true,        // Automatically refetch on component mount
        refetchOnReconnect: true,    // Automatically refetch on network reconnect
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: false,        // Controlled by ScrollToTopOnRouteChange to avoid jumping on initial load
    defaultPreloadStaleTime: 30_000, // 30s link preload freshness to prevent loader thrashing
  });

  return router;
};
