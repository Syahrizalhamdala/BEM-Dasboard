import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Calendar, FileText } from 'lucide-react';
import { getRecentActivities } from '../../api/dashboardApi';

const typeConfig = {
  attendance: { icon: Clock, bg: 'rgba(122,31,43,0.10)', color: '#7A1F2B', badgeLabel: 'Absensi', badgeBg: 'rgba(122,31,43,0.10)', badgeColor: '#7A1F2B' },
  agenda: { icon: Calendar, bg: '#E6F1FB', color: '#185FA5', badgeLabel: 'Agenda', badgeBg: '#E6F1FB', badgeColor: '#185FA5' },
  proposal: { icon: FileText, bg: '#EAF3DE', color: '#3B6D11', badgeLabel: 'Proposal', badgeBg: '#EAF3DE', badgeColor: '#3B6D11' },
};

function getConfig(type) {
  return typeConfig[type] || { icon: FileText, bg: '#f1f5f9', color: '#64748b', badgeLabel: type || 'Lainnya', badgeBg: '#f1f5f9', badgeColor: '#64748b' };
}

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return 'Baru saja';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return new Date(dateStr).toLocaleDateString('id-ID');
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetch() {
      try {
        const data = await getRecentActivities();
        if (mounted) setActivities(data);
      } catch {
        if (mounted) setActivities([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetch();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="bg-white rounded-xl border border-slate-200/70 p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-900">Aktivitas Terbaru</h3>
      </div>

      {loading && (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-7 h-7 rounded-lg skeleton-shimmer" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 skeleton-shimmer rounded w-3/4" />
                <div className="h-2.5 skeleton-shimmer rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-slate-500">Belum ada aktivitas</p>
        </div>
      )}

      {!loading && activities.length > 0 && (
        <div className="flex flex-col">
          {activities.slice(0, 8).map((item, idx) => {
            const config = getConfig(item.type);
            const Icon = config.icon;

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 py-2.5"
                style={idx < activities.slice(0, 8).length - 1 ? { borderBottom: '0.5px solid #e2e8f0' } : {}}
              >
                <div
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 28, height: 28, borderRadius: 7, backgroundColor: config.bg, color: config.color }}
                >
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 truncate">{item.message}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{relativeTime(item.created_at)}</p>
                </div>
                <span
                  className="shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full self-start mt-0.5"
                  style={{ backgroundColor: config.badgeBg, color: config.badgeColor }}
                >
                  {config.badgeLabel}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
