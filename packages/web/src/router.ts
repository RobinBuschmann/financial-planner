import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { RouteNotFoundComponent } from "./common/components/RouteNotFoundComponent.tsx";
import type { QueryClient } from "@tanstack/react-query";

export type RouterContext = { queryClient: QueryClient; userId: string };

export const router = createRouter({
  routeTree,
  context: { queryClient: undefined!, userId: "" },
  defaultNotFoundComponent: RouteNotFoundComponent,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
