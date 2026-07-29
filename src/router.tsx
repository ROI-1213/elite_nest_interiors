import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60_000,   // 5 min — data is "fresh" for 5 min, no background refetch
        gcTime: 10 * 60_000,     // 10 min — keep cache alive across navigation
        retry: 0,                // don't retry failed Supabase queries (use fallback instead)
        refetchOnWindowFocus: false, // don't refetch when user switches tabs/windows
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: false,     // disable auto scroll-to-top on route re-renders
    defaultPreloadStaleTime: 5 * 60_000,
  });

  return router;
};
