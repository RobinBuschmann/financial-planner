import * as React from "react";
import { createRoot } from "react-dom/client";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "./router.ts";
import { UserIdProvider, useUserId } from "./features/users/UserIdProvider.tsx";

const rootElement = document.getElementById("root")!;
const queryClient = new QueryClient();

const RouterWithContext = () => {
  const userId = useUserId();
  return <RouterProvider router={router} context={{ queryClient, userId }} />;
};

createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserIdProvider>
        <RouterWithContext />
      </UserIdProvider>
    </QueryClientProvider>
    <TanStackDevtools
      config={{ hideUntilHover: true }}
      plugins={[formDevtoolsPlugin()]}
    />
  </React.StrictMode>,
);
