import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "./formContext.ts";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

export default function TextField({
  label,
  type = "text",
}: {
  label: string;
  type?: string;
}) {
  const field = useFieldContext<string | number>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <div>
      <Label htmlFor={field.name} className="mb-2.5">
        {label}
      </Label>
      <Input
        id={field.name}
        type={type}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      {errors.map((error: string) => (
        <p key={error} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      ))}
    </div>
  );
}
