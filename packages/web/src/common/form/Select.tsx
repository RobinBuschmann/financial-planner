import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "./formContext.ts";
import {
  Select as UiSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select.tsx";
import { Label } from "@/components/ui/label.tsx";

export default function Select({
  label,
  options,
}: {
  label: string;
  options: { value: string; label: string }[];
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  const selectedLabel = options.find((o) => o.value === field.state.value)?.label;
  return (
    <div>
      <Label htmlFor={field.name} className="mb-2.5">
        {label}
      </Label>
      <UiSelect
        value={field.state.value}
        onValueChange={(v) => field.handleChange(v ?? "")}
      >
        <SelectTrigger id={field.name} className="w-full">
          {selectedLabel ?? (
            <span className="text-muted-foreground">— none —</span>
          )}
        </SelectTrigger>
        <SelectContent>
          {options
            .filter((o) => o.value !== "")
            .map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
        </SelectContent>
      </UiSelect>
      {errors.map((error: string) => (
        <p key={error} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      ))}
    </div>
  );
}
