import { useState, useEffect } from 'react';
import { getRecentAnggota } from '../../api/dashboardApi';

export default function MemberList() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecentAnggota(6)
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/70 p-4">
        <div className="h-4 w-28 skeleton-shimmer rounded mb-3" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 rounded-lg skeleton-shimmer" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 skeleton-shimmer rounded w-1/2" />
                <div className="h-2.5 skeleton-shimmer rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/70 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-slate-900">Anggota BEM</h3>
        <span className="text-xs text-slate-400">{members.length} anggota</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-burgundy flex items-center justify-center text-white text-xs font-medium shrink-0">
              {m.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-900 truncate">{m.nama}</p>
              <p className="text-xs text-slate-500 truncate">{m.angkatan ? `Angkatan ${m.angkatan}` : m.jabatan || 'Anggota'}</p>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">Belum ada anggota</p>
        )}
      </div>
    </div>
  );
}
