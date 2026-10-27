import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,                // Always fetch fresh content so admin updates appear immediately across all browsers
        gcTime: 5 * 60_000,          // Keep cached data in memory during tab session
        retry: 1,
        refetchOnWindowFocus: true,  // Automatically refetch whenever user focuses tab/browser
        refetchOnMount: true,        // Automatically refetch when any page component mounts
        refetchOnReconnect: true,    // Automatically refetch on network reconnect
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,     // enable auto scroll-to-top and position restoration
    defaultPreloadStaleTime: 0,
  });

  return router;
};
