'use client';

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

const data = [
  { name: 'Jan', Pengeluaran: 710, TotalBudget: 1400 },
  { name: 'Feb', Pengeluaran: 550, TotalBudget: 1800 },
  { name: 'Mar', Pengeluaran: 540, TotalBudget: 700 },
  { name: 'Apr', Pengeluaran: 510, TotalBudget: 490 },
  { name: 'May', Pengeluaran: 450, TotalBudget: 480 },
  { name: 'Jun', Pengeluaran: 220, TotalBudget: 340 },
  { name: 'Jul', Pengeluaran: 680, TotalBudget: 860 },
  { name: 'Aug', Pengeluaran: 400, TotalBudget: 900 },
  { name: 'Sep', Pengeluaran: 600, TotalBudget: 1100 },
  { name: 'Oct', Pengeluaran: 300, TotalBudget: 500 },
  { name: 'Nov', Pengeluaran: 750, TotalBudget: 1200 },
  { name: 'Dec', Pengeluaran: 900, TotalBudget: 1500 },
];

export default function ExpenseChart() {
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
              style={{ backgroundColor: CHART_BRAND.spend }}
            ></span>
            Pengeluaran
          </span>
          <span className="legend-pill">
            <span
              className="legend-dot"
              style={{ backgroundColor: CHART_BRAND.budget }}
            ></span>
            Total Budget
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={380}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
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
            dataKey="name"
            tick={{ fontSize: 11, fill: chart.axis }}
            tickLine={false}
            axisLine={{ stroke: chart.axisLine }}
            interval={0}
            tickMargin={10}
          />
          <YAxis
            domain={[0, 'auto']}
            tick={{ fontSize: 11, fill: chart.axis }}
            tickLine={false}
            axisLine={false}
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
    </div>
  );
}
