import { useForm } from "@/common/form/useForm.tsx";
import type { Transaction, Category } from "@/core/http/apiClient.ts";
import { z } from "zod";
import { zodValidator } from "@/common/form/zodValidator.ts";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card.tsx";

const createTransactionFormSchema = z.object({
  title: z.string().nonempty("Title is required"),
  amountInEuro: z
    .string()
    .nonempty("Amount is required")
    .transform((amount) => Number(amount))
    .refine((amount) => amount !== 0, "Amount must be greater or less than 0"),
  timestamp: z.string(),
  categoryId: z.string().transform((v) => (v === "" ? null : v)),
});

type CreateTransactionCardProps = {
  onAddTransaction: (transaction: Transaction) => Promise<unknown | void>;
  categories: Category[];
};

export const AddTransactionCardView = ({
  onAddTransaction,
  categories,
}: CreateTransactionCardProps) => {
  const form = useForm({
    defaultValues: {
      title: "",
      amountInEuro: "",
      timestamp: new Date().toISOString().slice(0, 16),
      categoryId: "",
    },
    validators: {
      onSubmit: zodValidator(createTransactionFormSchema),
    },
    onSubmit: async ({ value }) => {
      await onAddTransaction({
        id: crypto.randomUUID(),
        ...createTransactionFormSchema.parse({
          ...value,
          timestamp: new Date(value.timestamp).toISOString(),
        }),
      });
      form.reset();
    },
  });
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="space-y-4">
            <form.AppField
              name="title"
              children={(field) => <field.TextField label="Title" />}
            />
            <form.AppField
              name="amountInEuro"
              children={(field) => (
                <field.TextField label="Amount (€)" type="number" />
              )}
            />
            <form.AppField
              name="timestamp"
              children={(field) => (
                <field.TextField label="Date & Time" type="datetime-local" />
              )}
            />
            <form.AppField
              name="categoryId"
              children={(field) => (
                <field.Select
                  label="Category"
                  options={categories.map((c) => ({
                    value: c.id,
                    label: c.name,
                  }))}
                />
              )}
            />
          </div>
          <div className="mt-5">
            <form.AppForm>
              <form.SubscribeButton label="Add Transaction" />
            </form.AppForm>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
