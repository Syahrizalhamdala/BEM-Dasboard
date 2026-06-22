import { useState, useEffect } from 'react';
import { HiClock, HiCheckCircle, HiXCircle, HiDownload, HiEye } from 'react-icons/hi';
import { getChecks, downloadSigned } from '../../api/proposalApi';
import CheckResult from './CheckResult';

const statusBadge = {
  fail: { label: 'Perlu Perbaikan', class: 'bg-red-100 text-red-700' },
  lulus_ai: { label: 'Lolos AI', class: 'bg-burgundy/20 text-burgundy' },
  review: { label: 'Direview', class: 'bg-amber-100 text-amber-700' },
  approved: { label: 'Disetujui', class: 'bg-emerald-100 text-emerald-700' },
  signed: { label: 'Ditandatangani', class: 'bg-emerald-100 text-emerald-700' },
};

export default function ProposalHistory({ highlightId }) {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetch = async () => {
    try {
      const data = await getChecks();
      setChecks(data);
    } catch {
      setChecks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/70 p-5">
        <div className="h-4 w-24 skeleton-shimmer rounded mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 skeleton-shimmer rounded mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-slate-200/70 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-900">Riwayat Pengecekan</h3>
          <span className="text-xs text-slate-400">{checks.length} proposal</span>
        </div>

        {checks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-8">Belum ada pengecekan</p>
        ) : (
          <div className="space-y-1.5">
            {checks.map((check) => {
              const badge = statusBadge[check.status] || statusBadge.fail;
              return (
                <div
                  key={check.id}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ${
                    highlightId === check.id ? 'ring-2 ring-burgundy/40 bg-burgundy/10' : ''
                  }`}
                  onClick={() => setSelected(selected?.id === check.id ? null : check)}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <HiClock className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">{check.nama_file}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(check.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                      {' — '}{check.jumlah_issues} issues
                    </p>
                  </div>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${badge.class}`}>
                    {badge.label}
                  </span>
                  {check.status === 'signed' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadSigned(check.id); }}
                      className="p-1.5 text-slate-400 hover:text-burgundy"
                      title="Download Surat Pengesahan"
                    >
                      <HiDownload className="w-4 h-4" />
                    </button>
                  )}
                  <HiEye className="w-4 h-4 text-slate-300" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="mt-4">
          <CheckResult result={selected} onClose={() => setSelected(null)} />
        </div>
      )}
    </div>
  );
}
