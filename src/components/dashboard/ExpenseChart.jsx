'use client';

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useChartTheme, CHART_BRAND } from '../theme/useChartTheme.jsx';

const data = [
  { name: '0', Pengeluaran: 710, TotalBudget: 14, dots: 34 },
  { name: '5', Pengeluaran: 550, TotalBudget: 180, dots: 34 },
  { name: '10', Pengeluaran: 540, TotalBudget: 700, dots: 34 },
  { name: '15', Pengeluaran: 510, TotalBudget: 490, dots: 34 },
  { name: '20', Pengeluaran: 450, TotalBudget: 480, dots: 87 },
  { name: '25', Pengeluaran: 220, TotalBudget: 340, dots: 81 },
  { name: '30', Pengeluaran: 680, TotalBudget: 860, dots: 25 },
];

export default function ExpenseChart() {
  const chart = useChartTheme();

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">Pengeluaran vs Budget</h3>
          <p className="chart-subtitle">Ringkasan aktivitas mingguan</p>
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
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 10, left: 0 }}
        >
          <defs>
            <linearGradient id="lineSpend" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={CHART_BRAND.spendLight} />
              <stop offset="100%" stopColor={CHART_BRAND.spend} />
            </linearGradient>
            <linearGradient id="lineBudget" x1="0" y1="0" x2="1" y2="0">
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
            domain={[0, 1000]}
            ticks={[0, 200, 400, 600, 800, 1000]}
            tick={{ fontSize: 11, fill: chart.axis }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={{
              stroke: chart.cursor,
              strokeWidth: 1,
              strokeDasharray: '4 4',
            }}
            contentStyle={chart.tooltipContentStyle}
          />

          <Line
            type="monotone"
            dataKey="Pengeluaran"
            name="Pengeluaran"
            stroke="url(#lineSpend)"
            strokeWidth={3}
            dot={{
              fill: chart.tooltipBg,
              stroke: CHART_BRAND.spend,
              strokeWidth: 2,
              r: 3,
            }}
            activeDot={{
              r: 6,
              fill: CHART_BRAND.spend,
              stroke: chart.tooltipBg,
              strokeWidth: 2,
            }}
          />
          <Line
            type="monotone"
            dataKey="TotalBudget"
            name="Total Budget"
            stroke="url(#lineBudget)"
            strokeWidth={3}
            dot={{
              fill: chart.tooltipBg,
              stroke: CHART_BRAND.budget,
              strokeWidth: 2,
              r: 3,
            }}
            activeDot={{
              r: 6,
              fill: CHART_BRAND.budget,
              stroke: chart.tooltipBg,
              strokeWidth: 2,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
