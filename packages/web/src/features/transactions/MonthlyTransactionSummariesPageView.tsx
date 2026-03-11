import { MonthlyTransactionSummary } from "./MonthlyTransactionSummary.ts";
import { formatEuro } from "@/common/utils/formatEuro.ts";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@/components/ui/table.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

type MonthlyGroupedTransactionsViewProps = {
  summaries: MonthlyTransactionSummary[];
};

export const MonthlyTransactionSummariesPageView = ({
  summaries,
}: MonthlyGroupedTransactionsViewProps) => {
  return (
    <div>
      <h2 className="text-base font-semibold text-foreground mb-3">
        Monthly Overview
      </h2>
      {summaries.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No transactions yet.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Add transactions to see your monthly overview.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Income</TableHead>
                <TableHead className="text-right">Expenses</TableHead>
                <TableHead className="text-right">End Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summaries.map((summary) => (
                <TableRow key={summary.key}>
                  <TableCell className="text-foreground font-medium">
                    {summary.label}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums text-green-600">
                    {formatEuro(summary.income)}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums text-destructive">
                    {formatEuro(-summary.expenses)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium tabular-nums ${
                      summary.balance >= 0
                        ? "text-green-600"
                        : "text-destructive"
                    }`}
                  >
                    {formatEuro(summary.balance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};
