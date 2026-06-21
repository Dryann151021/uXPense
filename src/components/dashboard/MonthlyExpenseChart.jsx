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
import { useLevelContext } from '../../hooks/useLevelContext.jsx';

export default function MonthlyExpenseChart({
  data = [],
  weeklyCount = 0,
  loading = false,
}) {
  const chart = useChartTheme();
  const { level } = useLevelContext();

  const expensesCountToday = level.daily.expensesCount;
  const maxExpensesToday = 3; // Based on XP system
  const progress = Math.min((expensesCountToday / maxExpensesToday) * 100, 100);

  return (
    <div className="chart-container">
      <div className="recorded-head">
        <div>
          <h3 className="recorded-title">{weeklyCount}</h3>
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

      {loading ? (
        <div
          style={{
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          Loading...
        </div>
      ) : (
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
            <YAxis hide domain={[0, 'auto']} />
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
      )}

      <div className="quest-section">
        <div className="quest-label">
          Catat {maxExpensesToday} Pengeluaran Hari Ini (XP harian)
        </div>
        <div className="quest-bar-wrapper">
          <div className="quest-bar">
            <div
              className="quest-bar-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="quest-bar-text">
            {expensesCountToday}/{maxExpensesToday}
          </span>
        </div>
      </div>
    </div>
  );
}
