import { TransactionWithBalance } from "./transactionQueries.ts";
import { formatDate } from "@/common/utils/formatDate.ts";
import { formatEuro } from "@/common/utils/formatEuro.ts";
import { AccountBalanceCardView } from "./AccountBalanceCardView.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { Category } from "@/core/http/apiClient.ts";

type AllTransactionsViewProps = {
  transactions: TransactionWithBalance[];
  allTransactions: TransactionWithBalance[];
  onDelete: (id: string) => void;
  categories: Category[];
  categoryId: string | undefined;
  onCategoryChange: (id: string) => void;
};

export const AllTransactionsPageView = ({
  transactions,
  allTransactions,
  onDelete,
  categories,
  categoryId,
  onCategoryChange,
}: AllTransactionsViewProps) => {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-3">
        Transactions
      </h2>
      <AccountBalanceCardView transactions={allTransactions} />
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          categoryId={categoryId}
          onCategoryChange={onCategoryChange}
        />
      )}
      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No transactions yet.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Add one above to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {formatDate(transaction.timestamp)}
                </TableCell>
                <TableCell className="text-foreground font-medium">
                  {transaction.title}
                </TableCell>
                <TableCell
                  className={`text-right font-medium tabular-nums ${
                    Number(transaction.amountInEuro) >= 0
                      ? "text-green-600"
                      : "text-destructive"
                  }`}
                >
                  {formatEuro(transaction.amountInEuro)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(transaction.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

const CategoryFilter = ({
  categories,
  categoryId,
  onCategoryChange,
}: {
  categories: Category[];
  categoryId: string | undefined;
  onCategoryChange: (id: string) => void;
}) => (
  <div className="mb-4 flex items-center gap-2">
    <Label htmlFor="category-filter" className="text-muted-foreground shrink-0">
      Filter by category
    </Label>
    <Select
      value={categoryId ?? ""}
      onValueChange={(value) => onCategoryChange(value ?? "")}
    >
      <SelectTrigger id="category-filter">
        {categories.find(({ id }) => id === categoryId)?.name ?? (
          <span className="text-muted-foreground">All</span>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">All</SelectItem>
        {categories.map((cat) => (
          <SelectItem key={cat.id} value={cat.id}>
            {cat.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);
