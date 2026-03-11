import { useFormContext } from "./formContext.ts";
import { Button } from "@/components/ui/button.tsx";

export const SubscribeButton = ({ label }: { label: string }) => {
  const form = useFormContext();
  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => <Button type="submit" disabled={isSubmitting}>{label}</Button>}
    </form.Subscribe>
  );
};
