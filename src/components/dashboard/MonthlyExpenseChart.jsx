'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useChartTheme, CHART_BRAND } from '../theme/useChartTheme.jsx';

const data = [
  { name: 'Mon', Pengeluaran: 18 },
  { name: 'Tue', Pengeluaran: 25 },
  { name: 'Wed', Pengeluaran: 26 },
  { name: 'Thu', Pengeluaran: 40 },
  { name: 'Fri', Pengeluaran: 70 },
  { name: 'Sat', Pengeluaran: 32 },
  { name: 'Sun', Pengeluaran: 15 },
];

export default function MonthlyExpenseChart() {
  const progress = 50;
  const chart = useChartTheme();

  return (
    <div className="chart-container">
      <div className="recorded-head">
        <div>
          <h3 className="recorded-title">302</h3>
          <p className="recorded-subtitle">Pengeluaran dicatat minggu ini</p>
        </div>
        <span className="recorded-badge" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 17l6-6 4 4 8-8" />
            <path d="M17 7h4v4" />
          </svg>
        </span>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 5, bottom: 0, left: 5 }}
        >
          <defs>
            <linearGradient id="pengeluaranFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={CHART_BRAND.spend}
                stopOpacity={0.4}
              />
              <stop
                offset="100%"
                stopColor={CHART_BRAND.spend}
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="4 4"
            stroke={chart.grid}
            vertical={false}
          />
          <XAxis dataKey="name" interval="preserveStartEnd" />
          <YAxis hide domain={[0, 100]} />
          <Tooltip
            cursor={{
              stroke: chart.cursor,
              strokeWidth: 1,
              strokeDasharray: '4 4',
            }}
            contentStyle={chart.tooltipContentStyle}
          />
          <Area
            type="monotone"
            dataKey="Pengeluaran"
            name="Pengeluaran"
            fill="url(#pengeluaranFill)"
            stroke={CHART_BRAND.spend}
            strokeWidth={2.5}
            dot={false}
            activeDot={{
              r: 5,
              fill: CHART_BRAND.spend,
              stroke: chart.tooltipBg,
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="quest-section">
        <div className="quest-label">Catat 10 Pengeluaran</div>
        <div className="quest-bar">
          <div className="quest-bar-fill" style={{ width: `${progress}%` }}>
            <span className="quest-bar-text">5/10</span>
          </div>
        </div>
      </div>
    </div>
  );
}
