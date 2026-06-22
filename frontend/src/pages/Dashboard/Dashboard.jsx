import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, CalendarCheck, ClipboardCheck, FileText,
  ArrowUpRight, TrendingUp, Minus, AlertCircle
} from 'lucide-react';
import LineChartWidget from '../../components/charts/LineChartWidget';
import PieChartWidget from '../../components/charts/PieChartWidget';
import UpcomingEvents from '../../components/dashboard/UpcomingEvents';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import MemberList from '../../components/dashboard/MemberList';
import Skeleton from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats, getDashboardCharts } from '../../api/dashboardApi';
import { getReviewQueue } from '../../api/proposalApi';

const cardColors = [
  { bg: 'rgba(122,31,43,0.10)', icon: '#7A1F2B', link: '/anggota' },
  { bg: '#E6F1FB', icon: '#185FA5', link: '/agenda' },
  { bg: '#EAF3DE', icon: '#3B6D11', link: '/absensi' },
  { bg: '#FAEEDA', icon: '#854F0B', link: '/proposal-check' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnggota: 0,
    totalAgenda: 0,
    kehadiranHariIni: 0,
  });
  const [proposalCount, setProposalCount] = useState(0);
  const [trendData, setTrendData] = useState(null);

  async function fetchData() {
    try {
      const [statsData, queueData, chartsData] = await Promise.all([
        getDashboardStats().catch(() => ({ totalAnggota: 0, totalAgenda: 0, persentaseKehadiran: 0 })),
        getReviewQueue().catch(() => []),
        getDashboardCharts().catch(() => ({ kehadiranBulanan: [] })),
      ]);
      setStats({
        totalAnggota: statsData.totalAnggota || 0,
        totalAgenda: statsData.totalAgenda || 0,
        kehadiranHariIni: statsData.persentaseKehadiran || 0,
      });
      setProposalCount(queueData?.length || 0);
      setTrendData(chartsData?.kehadiranBulanan || []);
    } catch {
      setStats({ totalAnggota: 0, totalAgenda: 0, kehadiranHariIni: 0 });
      setProposalCount(0);
      setTrendData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, []);

  const getTrend = (index) => {
    if (index !== 2 || !trendData || trendData.length < 2) return { icon: Minus, label: 'Stabil', color: '#94a3b8' };
    const sorted = [...trendData].sort((a, b) => new Date(a.bulan) - new Date(b.bulan));
    const last = sorted[sorted.length - 1]?.hadir || 0;
    const prev = sorted[sorted.length - 2]?.hadir || 0;
    if (last > prev) return { icon: TrendingUp, label: `${(last - prev).toFixed(1)}%`, color: '#3B6D11' };
    if (last < prev) return { icon: AlertCircle, label: `${(prev - last).toFixed(1)}%`, color: '#A32D2D' };
    return { icon: Minus, label: 'Stabil', color: '#94a3b8' };
  };

  const statCards = [
    { icon: Users, label: 'Total Anggota', value: stats.totalAnggota, index: 0 },
    { icon: CalendarCheck, label: 'Agenda Aktif', value: stats.totalAgenda, index: 1 },
    { icon: ClipboardCheck, label: 'Kehadiran', value: `${stats.kehadiranHariIni}%`, index: 2, trend: true },
    { icon: FileText, label: 'Proposal Masuk', value: proposalCount, index: 3 },
  ];

  if (loading) {
    return (
      <div className="space-y-[14px] animate-fade-in">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2"><Skeleton className="h-72 rounded-xl" /></div>
          <div><Skeleton className="h-72 rounded-xl" /></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-[14px] animate-fade-in">
      {/* WELCOME BAR */}
      <div className="bg-white rounded-xl border border-slate-200/70 px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[15px] font-medium text-slate-900">
            Selamat datang, {user?.name?.split(' ')[0] || 'Pengurus'}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Pantau aktivitas Kabinet Nawasena dalam satu dashboard
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-5">
          <div className="text-right">
            <p className="text-[10px] text-slate-400">Total Anggota</p>
            <p className="text-[18px] font-medium text-slate-900" style={{ lineHeight: 1.2 }}>{stats.totalAnggota}</p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-right">
            <p className="text-[10px] text-slate-400">Kehadiran Hari Ini</p>
            <p className="text-[18px] font-medium text-slate-900" style={{ lineHeight: 1.2 }}>{stats.kehadiranHariIni}%</p>
          </div>
        </div>
      </div>

      {/* 3. STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px]">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const colors = cardColors[i];
          const trend = getTrend(i);
          const TrendIcon = trend.icon;
          return (
            <Link
              key={card.label}
              to={colors.link}
              className="block bg-white rounded-xl border border-slate-200/70 p-4 hover:border-slate-300 transition-colors duration-200 relative no-underline"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: colors.bg }}
                >
                  <Icon size={16} style={{ color: colors.icon }} />
                </div>
                <div
                  className="flex items-center justify-center shrink-0 text-slate-300 hover:text-slate-500 transition-colors border border-slate-200"
                  style={{ width: 22, height: 22, borderRadius: 6 }}
                >
                  <ArrowUpRight size={12} />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mb-0.5">{card.label}</p>
              <p className="text-[22px] font-medium text-slate-900" style={{ lineHeight: 1.1 }}>{card.value}</p>
              <div className="flex items-center gap-1 mt-1">
                <TrendIcon size={11} style={{ color: trend.color }} />
                <span style={{ fontSize: 10, color: trend.color }}>{trend.label}</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 4+5. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LineChartWidget />
        </div>
        <div>
          <PieChartWidget />
        </div>
      </div>

      {/* 6+7. AGENDA + ACTIVITIES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UpcomingEvents />
        <ActivityFeed />
      </div>

      {/* MEMBER LIST (existing functionality preserved) */}
      <MemberList />
    </div>
  );
}
