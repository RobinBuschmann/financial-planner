import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button.tsx";
import { Alert, AlertDescription } from "@/components/ui/alert.tsx";

export const RouteErrorComponent = () => {
  const router = useRouter();
  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-3">
      <Alert variant="destructive">
        <AlertDescription>
          Something went wrong loading this page.
        </AlertDescription>
      </Alert>
      <Button onClick={() => router.invalidate()}>Retry</Button>
    </div>
  );
};
