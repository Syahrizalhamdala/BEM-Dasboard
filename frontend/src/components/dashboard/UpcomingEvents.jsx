import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getAgendaTerdekat } from '../../api/dashboardApi';

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function getBadge(agenda) {
  const title = (agenda.agenda || agenda.title || '').toLowerCase();
  const lingkup = (agenda.lingkup || '').toLowerCase();
  if (title.includes('rapat') || lingkup.includes('rapat')) {
    return { label: 'Rapat', bg: 'rgba(122,31,43,0.10)', color: '#7A1F2B' };
  }
  if (title.includes('event') || title.includes('kegiatan') || lingkup.includes('event') || lingkup.includes('eksternal')) {
    return { label: 'Event', bg: '#EAF3DE', color: '#3B6D11' };
  }
  if (title.includes('seminar') || title.includes('workshop') || lingkup.includes('pelatihan')) {
    return { label: 'Seminar', bg: '#E6F1FB', color: '#185FA5' };
  }
  return { label: 'Agenda', bg: 'rgba(122,31,43,0.10)', color: '#7A1F2B' };
}

export default function UpcomingEvents() {
  const [agendaList, setAgendaList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAgendaTerdekat()
      .then(setAgendaList)
      .catch(() => setAgendaList([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/70 p-4">
        <div className="h-4 w-32 skeleton-shimmer rounded mb-3" />
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-slate-100 rounded-lg skeleton-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/70 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-900">Agenda Terdekat</h3>
        <Link
          to="/agenda"
          className="flex items-center gap-1 no-underline"
          style={{ fontSize: 11, color: '#7A1F2B', fontWeight: 500 }}
        >
          Lihat semua
          <ArrowUpRight size={12} />
        </Link>
      </div>
      <div className="flex flex-col">
        {agendaList.slice(0, 5).map((agenda, idx) => {
          const date = agenda.tanggal ? new Date(agenda.tanggal) : new Date();
          const day = date.getDate();
          const month = monthNames[date.getMonth()];
          const badge = getBadge(agenda);

          return (
            <div
              key={agenda.id}
              className="flex items-start gap-3 py-2.5"
              style={idx < agendaList.slice(0, 5).length - 1 ? { borderBottom: '0.5px solid #e2e8f0' } : {}}
            >
              <div className="text-center shrink-0" style={{ minWidth: 32 }}>
                <p className="text-base font-semibold text-slate-900 leading-none">{day}</p>
                <p className="text-[10px] text-slate-400 uppercase mt-0.5">{month}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-900 truncate">{agenda.agenda || agenda.title}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {agenda.waktu_mulai || ''}{agenda.tempat ? ` - ${agenda.tempat}` : ''}
                </p>
              </div>
              <span
                className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full self-start mt-0.5"
                style={{ backgroundColor: badge.bg, color: badge.color }}
              >
                {badge.label}
              </span>
            </div>
          );
        })}
        {agendaList.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">Belum ada agenda terdekat</p>
        )}
      </div>
    </div>
  );
}
