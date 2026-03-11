import { useRouterState, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger, tabsListVariants } from "./tabs.tsx";
import type { VariantProps } from "class-variance-authority";

type LinkTabsProps = {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof tabsListVariants>;

export function LinkTabs({
  children,
  variant = "line",
  className,
}: LinkTabsProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <Tabs value={pathname} className={className}>
      <TabsList variant={variant}>{children}</TabsList>
    </Tabs>
  );
}

type LinkTabProps = {
  to: string;
  children: ReactNode;
};

export function LinkTab({ to, children }: LinkTabProps) {
  return (
    <TabsTrigger
      value={to}
      nativeButton={false}
      render={(props) => <Link to={to as never} {...props} />}
    >
      {children}
    </TabsTrigger>
  );
}
