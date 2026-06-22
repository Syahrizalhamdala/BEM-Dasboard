import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardCharts } from '../../api/dashboardApi';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs shadow-sm">
        <p className="text-slate-500 mb-1">{label}</p>
        <p className="font-medium" style={{ color: '#7A1F2B' }}>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function LineChartWidget() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('6bulan');

  useEffect(() => {
    getDashboardCharts()
      .then((res) => {
        const raw = (res.kehadiranBulanan || []).map((d) => ({
          ...d,
          bulan: monthNames[new Date(d.bulan).getMonth()] || d.bulan,
        }));
        if (filter === '6bulan') {
          setData(raw.slice(-6));
        } else {
          const currentYear = new Date().getFullYear();
          setData(raw.filter((d) => new Date(d.bulan).getFullYear() === currentYear));
        }
      })
      .catch(() => setData([]));
  }, [filter]);

  return (
    <div className="bg-white rounded-xl border border-slate-200/70 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-900">Kehadiran Bulanan</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-[11px] border border-slate-200 rounded-md px-2 py-1 text-slate-500 bg-white outline-none"
        >
          <option value="6bulan">6 Bulan</option>
          <option value="tahunini">Tahun Ini</option>
        </select>
      </div>
      <div className="h-64 w-full min-w-0" style={{ position: 'relative' }}>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis
                dataKey="bulan"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(0,0,0,0.04)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
              <Line
                type="monotone"
                dataKey="hadir"
                stroke="#7A1F2B"
                strokeWidth={2}
                dot={{ fill: '#7A1F2B', r: 4 }}
                activeDot={{ fill: '#7A1F2B', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-slate-400">
            Belum ada data kehadiran
          </div>
        )}
      </div>
    </div>
  );
}
