import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { getDashboardCharts } from '../../api/dashboardApi';

const COLOR_MAP = {
  'Hadir': '#7A1F2B',
  'Belum absen': '#E5E5E5',
  'Izin/Sakit': '#EAF3DE',
};

const DEFAULT_COLORS = ['#7A1F2B', '#E5E5E5', '#EAF3DE'];

export default function PieChartWidget() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getDashboardCharts()
      .then((res) => setData(res.statusKehadiran || []))
      .catch(() => setData([]));
  }, []);

  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200/70 p-4 h-full flex flex-col">
      <h3 className="text-sm font-medium text-slate-900 mb-3">Status Kehadiran</h3>
      <div className="flex-1 flex items-center justify-center min-w-0">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="72%"
                outerRadius="90%"
                dataKey="value"
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLOR_MAP[entry.name] || DEFAULT_COLORS[index] || '#E5E5E5'}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <span className="text-xs text-slate-400">Belum ada data</span>
        )}
      </div>
      {data.length > 0 && (
        <div className="flex flex-col gap-2 mt-3">
          {data.map((item, index) => {
            const color = COLOR_MAP[item.name] || DEFAULT_COLORS[index] || '#E5E5E5';
            const pct = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
            return (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <span
                    className="w-2 h-2 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  {item.name}
                </span>
                <span className="text-slate-900 font-medium">{pct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
