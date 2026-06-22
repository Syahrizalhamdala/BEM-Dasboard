import { useState, useEffect } from 'react';
import { HiUpload, HiDocumentText, HiCheckCircle, HiXCircle, HiInformationCircle } from 'react-icons/hi';
import { getAktifGuideline, checkProposal } from '../../api/proposalApi';

export default function UploadProposal({ onCheckDone }) {
  const [file, setFile] = useState(null);
  const [guideline, setGuideline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [guidelineLoading, setGuidelineLoading] = useState(true);

  useEffect(() => {
    getAktifGuideline()
      .then(setGuideline)
      .catch(() => setGuideline(null))
      .finally(() => setGuidelineLoading(false));
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const ext = selected.name.split('.').pop().toLowerCase();
      if (!['pdf', 'doc', 'docx'].includes(ext)) {
        setError('Format file harus PDF atau Word (doc/docx).');
        setFile(null);
        return;
      }
      if (selected.size > 20 * 1024 * 1024) {
        setError('Ukuran file maksimal 20MB.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selected);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    if (!guideline) {
      setError('Belum ada panduan aktif. Hubungi admin.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await checkProposal(file);
      onCheckDone(result);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memproses proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl border border-slate-200/70 p-5">
          <h3 className="text-sm font-medium text-slate-900 mb-4">Upload Proposal</h3>

          <form onSubmit={handleSubmit}>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-burgundy/30 transition-colors">
              {file ? (
                <div className="space-y-3">
                  <HiDocumentText className="w-10 h-10 text-burgundy mx-auto" />
                  <p className="text-sm font-medium text-slate-900">{file.name}</p>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <HiUpload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">
                    <span className="text-burgundy font-medium">Klik untuk upload</span> atau drag & drop
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF atau Word (max 20MB)</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {error && (
              <div className="mt-3 flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
                <HiXCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading || !guideline}
              className="mt-4 w-full px-4 py-2.5 bg-burgundy text-white text-sm rounded-xl hover:bg-burgundy-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Memeriksa proposal...' : 'Cek Kesesuaian Proposal'}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl border border-slate-200/70 p-5">
          <h3 className="text-sm font-medium text-slate-900 mb-3">Panduan Aktif</h3>
          {guidelineLoading ? (
            <div className="h-12 skeleton-shimmer rounded" />
          ) : guideline ? (
            <div className="flex items-start gap-2.5">
              <HiInformationCircle className="w-4 h-4 text-burgundy/80 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-slate-700">{guideline.judul}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Diupload {new Date(guideline.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2.5">
              <HiXCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm text-slate-500">Belum ada panduan. Hubungi admin.</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200/70 p-5 mt-3">
          <h3 className="text-sm font-medium text-slate-900 mb-2">Alur</h3>
          <ol className="text-xs text-slate-500 space-y-2 list-decimal list-inside">
            <li>Upload file proposal (PDF/Word)</li>
            <li>AI periksa kesesuaian dengan panduan</li>
            <li>Lihat hasil: flag + saran perbaikan</li>
            <li>Jika lolos AI → review admin</li>
            <li>Jika disetujui → tanda tangan Presma</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
