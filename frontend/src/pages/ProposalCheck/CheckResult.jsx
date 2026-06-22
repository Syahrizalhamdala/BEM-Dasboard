import { HiCheckCircle, HiXCircle, HiLightBulb, HiX } from 'react-icons/hi';

const statusConfig = {
  fail: { icon: HiXCircle, label: 'Perlu Perbaikan', color: 'text-red-600', bg: 'bg-red-50' },
  lulus_ai: { icon: HiCheckCircle, label: 'Lolos AI — Menunggu Review Admin', color: 'text-burgundy', bg: 'bg-burgundy/10' },
  approved: { icon: HiCheckCircle, label: 'Disetujui Admin — Siap Ditandatangani', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  signed: { icon: HiCheckCircle, label: 'Sudah Ditandatangani', color: 'text-emerald-600', bg: 'bg-emerald-50' },
};

export default function CheckResult({ result, onClose }) {
  const issues = result?.hasil_check || [];
  const config = statusConfig[result?.status] || statusConfig.fail;
  const Icon = config.icon;

  return (
    <div className="bg-white rounded-xl border border-slate-200/70 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className={`flex items-start gap-3 ${config.bg} rounded-lg p-3 flex-1`}>
          <Icon className={`w-5 h-5 ${config.color} mt-0.5 shrink-0`} />
          <div>
            <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
            <p className="text-xs text-slate-500 mt-1">
              {result?.nama_file} — {issues.length} ketidaksesuaian ditemukan
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 ml-2 text-slate-400 hover:text-slate-600">
            <HiX className="w-4 h-4" />
          </button>
        )}
      </div>

      {result?.admin_notes && (
        <div className="mb-4 p-3 bg-amber-50 rounded-lg text-sm">
          <p className="font-medium text-amber-800 text-xs mb-1">Catatan Admin:</p>
          <p className="text-amber-700 text-xs">{result.admin_notes}</p>
        </div>
      )}

      {issues.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-900">Daftar Ketidaksesuaian</h4>
          {issues.map((issue, index) => (
            <div key={index} className="border border-red-100 rounded-lg p-3 bg-red-50/50">
              <div className="flex items-start gap-2">
                <HiXCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <p className="text-xs font-medium text-red-800">
                    {issue.bagian || `Issue #${index + 1}`}
                  </p>
                  <p className="text-xs text-red-700">{issue.masalah}</p>
                  {issue.acuan && (
                    <div className="bg-red-100/50 rounded px-2 py-1">
                      <p className="text-[11px] text-red-600">
                        <span className="font-medium">Acuan panduan:</span> {issue.acuan}
                      </p>
                    </div>
                  )}
                  <div className="flex items-start gap-1.5 pt-1">
                    <HiLightBulb className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-slate-600">{issue.saran}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {issues.length === 0 && result?.status === 'lulus_ai' && (
        <div className="text-center py-4">
          <HiCheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm text-slate-700">Proposal sesuai dengan panduan.</p>
          <p className="text-xs text-slate-400 mt-1">Menunggu review admin untuk proses selanjutnya.</p>
        </div>
      )}
    </div>
  );
}
