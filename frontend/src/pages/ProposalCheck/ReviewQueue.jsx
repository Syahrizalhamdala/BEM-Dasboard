import { useState, useEffect } from 'react';
import { HiCheckCircle, HiXCircle, HiClipboardList, HiEye } from 'react-icons/hi';
import { getReviewQueue, reviewProposal } from '../../api/proposalApi';

export default function ReviewQueue() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetch = async () => {
    try {
      const data = await getReviewQueue();
      setQueue(data);
    } catch {
      setQueue([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleReview = async (id, action) => {
    setActionLoading(id);
    try {
      await reviewProposal(id, action, notes);
      setQueue((prev) => prev.filter((c) => c.id !== id));
      setSelected(null);
      setNotes('');
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/70 p-5">
        <div className="h-4 w-32 skeleton-shimmer rounded mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 skeleton-shimmer rounded mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-[14px] animate-fade-in">
      <div className="mb-4">
        <h1 className="text-[15px] font-medium text-slate-900">Review Proposal</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {queue.length} proposal menunggu review
        </p>
      </div>

      {queue.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/70 p-8 text-center">
          <HiClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Tidak ada proposal yang menunggu review</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/70 p-5">
          <div className="space-y-2">
            {queue.map((check) => (
              <div key={check.id}>
                <div
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer ${
                    selected?.id === check.id ? 'bg-slate-50 ring-1 ring-slate-200' : ''
                  }`}
                  onClick={() => setSelected(selected?.id === check.id ? null : check)}
                >
                  <div className="w-8 h-8 rounded-lg bg-burgundy/20 flex items-center justify-center shrink-0">
                    <HiEye className="w-4 h-4 text-burgundy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-900 truncate">{check.nama_file}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(check.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">Klik untuk detail</span>
                </div>

                {selected?.id === check.id && (
                  <div className="ml-11 pl-3 border-l-2 border-slate-200 mt-2 mb-2">
                    <div className="bg-slate-50 rounded-lg p-3 mb-3">
                      <p className="text-xs font-medium text-slate-700 mb-2">Hasil Pengecekan AI:</p>
                      {check.hasil_check?.length > 0 ? (
                        <div className="space-y-1.5">
                          {check.hasil_check.map((issue, i) => (
                            <div key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                              <HiXCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                              <span>{issue.bagian}: {issue.masalah}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-emerald-600">Tidak ada ketidaksesuaian.</p>
                      )}
                    </div>

                    <textarea
                      placeholder="Catatan review (opsional)..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-burgundy/20 mb-2"
                      rows={2}
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReview(check.id, 'approve')}
                        disabled={actionLoading === check.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all"
                      >
                        <HiCheckCircle className="w-3.5 h-3.5" />
                        Setujui
                      </button>
                      <button
                        onClick={() => handleReview(check.id, 'tolak')}
                        disabled={actionLoading === check.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all"
                      >
                        <HiXCircle className="w-3.5 h-3.5" />
                        Tolak
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
