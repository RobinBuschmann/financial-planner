import { z } from "zod";
import type { Budget, Category } from "@/core/http/apiClient.ts";
import { useForm } from "@/common/form/useForm.tsx";
import { zodValidator } from "@/common/form/zodValidator.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
} from "@/components/ui/item.tsx";

const budgetFormSchema = z.object({
  categoryId: z.string().nonempty("Category is required"),
  limitInEuro: z
    .string()
    .nonempty("Limit is required")
    .transform(Number)
    .refine((n) => n > 0, "Limit must be greater than 0"),
});

type AddBudgetCardProps = {
  categories: Category[];
  budgets: Budget[];
  onAdd: (input: {
    categoryId: string;
    limitInEuro: number;
  }) => Promise<unknown>;
  onDelete: (id: string) => Promise<unknown>;
};

export const AddBudgetCard = ({
  categories,
  budgets,
  onAdd,
  onDelete,
}: AddBudgetCardProps) => {
  const budgetedCategoryIds = new Set(budgets.map((b) => b.categoryId));
  const availableCategories = categories.filter(
    (c) => !budgetedCategoryIds.has(c.id),
  );
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const form = useForm({
    defaultValues: { categoryId: "", limitInEuro: "" },
    validators: { onSubmit: zodValidator(budgetFormSchema) },
    onSubmit: async ({ value }) => {
      await onAdd(budgetFormSchema.parse(value));
      form.reset();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budgets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ItemGroup className="gap-0">
          {budgets.map((budget) => {
            const cat = categoryById.get(budget.categoryId);
            return (
              <Item
                key={budget.id}
                className="border-0 border-b-1 border-accent"
              >
                <ItemContent>{cat?.name ?? budget.categoryId}</ItemContent>
                <ItemActions>
                  <span className="text-sm text-muted-foreground tabular-nums">
                    €{budget.limitInEuro.toFixed(2)} / month
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(budget.id)}
                  >
                    Delete
                  </Button>
                </ItemActions>
              </Item>
            );
          })}
        </ItemGroup>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add a category first to create a budget.
          </p>
        ) : (
          <form
            className="space-y-3 mt-2"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <form.AppField
              name="categoryId"
              children={(field) => (
                <field.Select
                  label="Category"
                  options={availableCategories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                />
              )}
            />
            <form.AppField
              name="limitInEuro"
              children={(field) => (
                <field.TextField label="Monthly limit (€)" type="number" />
              )}
            />
            <form.AppForm>
              <form.SubscribeButton label="Add Budget" />
            </form.AppForm>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
