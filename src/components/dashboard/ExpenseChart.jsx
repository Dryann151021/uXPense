'use client';

import Skeleton from 'react-loading-skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useChartTheme, CHART_BRAND } from '../theme/useChartTheme.jsx';

export default function ExpenseChart({ data = [], loading = false }) {
  const chart = useChartTheme();

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Pengeluaran vs Budget</h3>
          <p className="chart-subtitle">Ringkasan aktivitas bulanan</p>
        </div>
        <div className="chart-legend-pills">
          <span className="legend-pill">
            <span
              className="legend-dot"
              style={{ backgroundColor: CHART_BRAND.budget }}
            ></span>
            Total Budget
          </span>
          <span className="legend-pill">
            <span
              className="legend-dot"
              style={{ backgroundColor: CHART_BRAND.spend }}
            ></span>
            Pengeluaran
          </span>
        </div>
      </div>
      {loading ? (
        <div className="chart-skeleton" aria-label="Memuat grafik">
          <Skeleton height={32} width="92%" />
          <Skeleton height={32} width="72%" />
          <Skeleton height={32} width="84%" />
          <Skeleton height={32} width="58%" />
          <Skeleton height={32} width="68%" />
          <Skeleton height={32} width="78%" />
          <Skeleton height={32} width="64%" />
          <Skeleton height={32} width="88%" />
        </div>
      ) : (
        <ResponsiveContainer
          id="expense-chart-container"
          width="100%"
          height="100%"
        >
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, bottom: 10, left: -25 }}
            barCategoryGap="20%"
            barGap={4}
          >
            <defs>
              <linearGradient id="barSpend" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={CHART_BRAND.spendLight} />
                <stop offset="100%" stopColor={CHART_BRAND.spend} />
              </linearGradient>
              <linearGradient id="barBudget" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={CHART_BRAND.budgetLight} />
                <stop offset="100%" stopColor={CHART_BRAND.budget} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={chart.grid}
              vertical={false}
            />
            <XAxis
              id="expense-xaxis"
              dataKey="name"
              padding={{ left: 0, right: 0 }}
              tick={{ fill: chart.axis }}
              tickLine={false}
              axisLine={{ stroke: chart.axisLine }}
              interval={0}
              tickMargin={10}
            />
            <YAxis
              id="expense-yaxis"
              domain={[0, 'auto']}
              tick={{ fill: chart.axis }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  const millions = value / 1000000;
                  return Number.isInteger(millions)
                    ? `${millions} jt`
                    : `${millions.toFixed(1)} jt`;
                }
                return value > 0 ? `${value / 1000}k` : 0;
              }}
            />
            <Tooltip
              cursor={{ fill: chart.tooltipBg, opacity: 0.4 }}
              contentStyle={chart.tooltipContentStyle}
            />
            <Bar
              dataKey="TotalBudget"
              name="Total Budget"
              fill="url(#barBudget)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="Pengeluaran"
              name="Pengeluaran"
              fill="url(#barSpend)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
