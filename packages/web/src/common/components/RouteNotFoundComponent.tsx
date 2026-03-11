import { Link } from "@tanstack/react-router";

export const RouteNotFoundComponent = () => (
  <div className="max-w-xl mx-auto px-4 py-10">
    <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
    <p className="text-sm text-muted-foreground mb-6">
      The page you&apos;re looking for doesn&apos;t exist.
    </p>
    <Link to="/" className="text-sm text-primary hover:underline">
      Go to dashboard
    </Link>
  </div>
);
