import { z } from "zod";
import type { Category } from "@/core/http/apiClient.ts";
import { useForm } from "@/common/form/useForm.tsx";
import { zodValidator } from "@/common/form/zodValidator.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Item, ItemActions, ItemContent } from "@/components/ui/item.tsx";

const categoryFormSchema = z.object({
  name: z.string().nonempty("Name is required"),
});

type AddCategoryCardProps = {
  categories: Category[];
  onAdd: (input: { name: string }) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
};

export const AddCategoryCard = ({
  categories,
  onAdd,
  onDelete,
}: AddCategoryCardProps) => {
  const form = useForm({
    defaultValues: { name: "" },
    validators: { onSubmit: zodValidator(categoryFormSchema) },
    onSubmit: async ({ value }) => {
      await onAdd(categoryFormSchema.parse(value));
      form.reset();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.map((cat) => (
          <Item key={cat.id} className="border-0 border-b-1 border-accent">
            <ItemContent>{cat.name}</ItemContent>
            <ItemActions>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(cat.id)}
              >
                Delete
              </Button>
            </ItemActions>
          </Item>
        ))}
        <form
          className="flex gap-2 mt-2"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="flex-1">
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="" />}
            />
          </div>
          <div className="flex items-end">
            <form.AppForm>
              <form.SubscribeButton label="Add" />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
