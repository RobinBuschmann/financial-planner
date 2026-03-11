import type { BudgetProgress } from "./computeBudgetProgress.ts";
import { formatEuro } from "@/common/utils/formatEuro.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Progress } from "@/components/ui/progress.tsx";

type BudgetOverviewPageViewProps = {
  progress: BudgetProgress[];
};

export const BudgetOverviewPageView = ({
  progress,
}: BudgetOverviewPageViewProps) => {
  if (progress.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No budgets set up yet.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Go to Manage to add categories and budgets.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {progress.map(
        ({ budget, category, spentInEuro, limitInEuro, percentage }) => {
          const capped = Math.min(percentage, 100);
          const isOver = percentage > 100;
          return (
            <Card key={budget.id}>
              <CardContent>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formatEuro(spentInEuro)} / {formatEuro(limitInEuro)}
                  </span>
                </div>
                <Progress value={capped} />
                {isOver && (
                  <p className="mt-1.5 text-xs text-destructive font-medium">
                    Over budget by {formatEuro(spentInEuro - limitInEuro)}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        },
      )}
    </div>
  );
};
