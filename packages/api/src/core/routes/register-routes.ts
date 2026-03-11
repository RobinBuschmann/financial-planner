import { multi } from "../../common/inject/container.ts";
import type { Route } from "./route.ts";

export const registerRoutes = <TContainer>(
  factory: (container: TContainer) => Route,
) => multi("routes", factory);
