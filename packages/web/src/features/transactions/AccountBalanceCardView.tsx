import { Area, AreaChart, ReferenceLine, YAxis } from "recharts";
import { formatEuro } from "@/common/utils/formatEuro.ts";
import { TransactionWithBalance } from "./transactionQueries.ts";
import { Card } from "@/components/ui/card.tsx";

const CHART_HEIGHT = 96;
const GREEN = "#22c55e";
const RED = "#ef4444";

export type AccountBalanceCardViewProps = {
  transactions: TransactionWithBalance[];
};

export const AccountBalanceCardView = ({
  transactions,
}: AccountBalanceCardViewProps) => {
  const balance = transactions[0]?.runningBalance ?? 0;
  const balances = [
    ...transactions.map(({ runningBalance }) => runningBalance),
    0,
  ];
  const chartData = balances.map((balance) => ({ balance })).toReversed();

  const domainMin = Math.min(0, ...balances);
  const domainMax = Math.max(0, ...balances);
  const hasNegative = domainMin < 0;

  // Position of zero within the domain, as a fraction from the top of the chart.
  // In SVG gradients y=0 is top, y=1 is bottom.
  const zeroPercent =
    hasNegative && domainMax !== domainMin
      ? (domainMax / (domainMax - domainMin)) * 100
      : 100;

  return (
    <Card className="flex-row items-stretch overflow-hidden mb-4 gap-0 pb-0">
      <div className="flex-1">
        <AreaChart
          width="100%"
          height={CHART_HEIGHT}
          data={chartData}
          margin={{ top: 8, right: 0, bottom: hasNegative ? 5 : 0, left: 0 }}
        >
          <defs>
            <linearGradient id="balanceStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset={`${zeroPercent}%`} stopColor={GREEN} />
              <stop offset={`${zeroPercent}%`} stopColor={RED} />
            </linearGradient>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={`${zeroPercent}%`}
                stopColor={GREEN}
                stopOpacity={0.1}
              />
              <stop
                offset={`${zeroPercent}%`}
                stopColor={RED}
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <YAxis domain={[domainMin, domainMax]} hide />
          {hasNegative && (
            <ReferenceLine y={0} stroke="#94a3b8" strokeWidth={1} />
          )}
          <Area
            type="monotone"
            dataKey="balance"
            stroke="url(#balanceStroke)"
            strokeWidth={2}
            fill="url(#balanceFill)"
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </div>
      <div className="p-5 text-right shrink-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          Account Balance
        </p>
        <p
          className={`text-3xl font-bold tabular-nums ${
            balance >= 0 ? "text-green-600" : "text-destructive"
          }`}
        >
          {formatEuro(balance)}
        </p>
      </div>
    </Card>
  );
};
