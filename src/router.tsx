import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60_000,   // 5 min — data is "fresh" for 5 min, no background refetch
        gcTime: 10 * 60_000,     // 10 min — keep cache alive across navigation
        retry: 0,                // don't retry failed queries (use fallback instead)
        refetchOnWindowFocus: false, // don't refetch when user switches tabs/windows
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,     // enable auto scroll-to-top and position restoration
    defaultPreloadStaleTime: 5 * 60_000,
  });

  return router;
};
