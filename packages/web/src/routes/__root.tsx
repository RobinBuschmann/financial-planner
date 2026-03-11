import { createRootRouteWithContext } from "@tanstack/react-router";
import { App } from "../App.tsx";
import type { RouterContext } from "../router.ts";

export const Route = createRootRouteWithContext<RouterContext>()({ component: App });
