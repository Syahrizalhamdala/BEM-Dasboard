import { useState } from 'react';
import { HiX, HiDownload, HiRefresh, HiEye, HiEyeOff } from 'react-icons/hi';
import { Badge } from '../ui';
import { toggleAgendaQr, regenerateAgendaQr } from '../../api/agendaApi';

const QR_STATUS_MAP = {
  active: { label: 'Aktif', variant: 'success' },
  expired: { label: 'Expired', variant: 'neutral' },
  inactive: { label: 'Belum Dimulai', variant: 'warning' },
};

export default function AgendaQRCodeModal({ agenda, onClose, onUpdate }) {
  const [regenerating, setRegenerating] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [localAgenda, setLocalAgenda] = useState(agenda);

  const status = QR_STATUS_MAP[localAgenda.qr_status] || QR_STATUS_MAP.inactive;
  const isExpired = localAgenda.qr_status === 'expired';

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await toggleAgendaQr(localAgenda.id);
      setLocalAgenda((prev) => ({ ...prev, is_qr_active: res.is_active }));
      onUpdate?.();
    } catch {
      // silent
    } finally {
      setToggling(false);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const data = await regenerateAgendaQr(localAgenda.id);
      setLocalAgenda((prev) => ({
        ...prev,
        qr_token: data.qr_token,
        qr_code_url: data.qr_code_url,
        is_qr_active: true,
      }));
      onUpdate?.();
    } catch {
      // silent
    } finally {
      setRegenerating(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(localAgenda.qr_code_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-${localAgenda.agenda.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // silent
    }
  };

  const dateStr = localAgenda.tanggal
    ? new Date(localAgenda.tanggal).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in">
        <div className="relative px-5 pt-5 pb-3 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-8">
              <h2 className="text-sm font-semibold text-slate-900 truncate">
                {localAgenda.agenda}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{dateStr}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant={status.variant} dot>
              {status.label}
            </Badge>
            {isExpired && (
              <span className="text-[10px] text-slate-400">Agenda telah selesai</span>
            )}
          </div>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="w-[220px] h-[220px] bg-white rounded-xl border border-slate-100 flex items-center justify-center p-3 shadow-sm">
            {localAgenda.qr_code_url ? (
              <img
                src={localAgenda.qr_code_url}
                alt={`QR Code ${localAgenda.agenda}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-xs text-slate-400 text-center">
                QR Code belum tersedia
              </div>
            )}
          </div>

          <div className="mt-4 w-full flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-burgundy text-white rounded-lg text-xs font-medium hover:bg-burgundy-dark transition-colors"
            >
              <HiDownload className="w-3.5 h-3.5" />
              Download
            </button>
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {regenerating ? (
                <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <HiRefresh className="w-3.5 h-3.5" />
              )}
              Regenerate
            </button>
          </div>

          {!isExpired && (
            <button
              onClick={handleToggle}
              disabled={toggling}
              className={`mt-2 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                localAgenda.is_qr_active
                  ? 'bg-red-50 text-red-700 hover:bg-red-100'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              {toggling ? (
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : localAgenda.is_qr_active ? (
                <><HiEyeOff className="w-3.5 h-3.5" /> Nonaktifkan QR</>
              ) : (
                <><HiEye className="w-3.5 h-3.5" /> Aktifkan QR</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
