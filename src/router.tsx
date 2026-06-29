import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Data stays fresh for 5 minutes — no refetch on every page visit
        staleTime: 5 * 60 * 1000,
        // Keep unused data in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Don't retry on failure more than once
        retry: 1,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: false,

    // Start fetching on hover/focus — by the time the user clicks,
    // data is often already in the cache.
    defaultPreload: "intent",

    // Preloaded data is considered fresh for 30 seconds
    defaultPreloadStaleTime: 30_000,

    // Navigate immediately; show the new page with its skeleton/loading state
    // rather than staying on the old page while data loads.
    // 0 = no artificial delay before showing the pending UI.
    defaultPendingMs: 0,
  });

  return router;
};
