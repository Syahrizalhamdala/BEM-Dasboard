import { useState, useEffect } from 'react';
import { HiUpload, HiDocumentText, HiCheckCircle, HiXCircle, HiLockClosed } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import { getGuidelines, getAktifGuideline, uploadGuideline } from '../../api/proposalApi';

export default function GuidelineManager() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [guidelines, setGuidelines] = useState([]);
  const [aktif, setAktif] = useState(null);
  const [file, setFile] = useState(null);
  const [judul, setJudul] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetch = async () => {
    try {
      const [all, active] = await Promise.all([getGuidelines(), getAktifGuideline()]);
      setGuidelines(all);
      setAktif(active);
    } catch {
      setGuidelines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const ext = selected.name.split('.').pop().toLowerCase();
      if (!['pdf', 'doc', 'docx'].includes(ext)) {
        setError('Format file harus PDF atau Word.');
        setFile(null);
        return;
      }
      setError('');
      setFile(selected);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !judul.trim()) return;
    setUploading(true);
    setError('');

    try {
      await uploadGuideline(file, judul.trim());
      setFile(null);
      setJudul('');
      await fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal upload.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/70 p-5">
        <div className="h-4 w-32 skeleton-shimmer rounded mb-4" />
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-14 skeleton-shimmer rounded mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {isAdmin && (
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200/70 p-5">
            <h3 className="text-sm font-medium text-slate-900 mb-4">Upload Panduan Baru</h3>

            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-xs text-slate-500 mb-1">Judul Panduan</label>
                <input
                  type="text"
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="cth: Panduan Proposal BEM 2026"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 outline-none focus:ring-2 focus:ring-burgundy/20"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-burgundy/30 transition-colors mb-4">
                {file ? (
                  <div className="space-y-2">
                    <HiDocumentText className="w-8 h-8 text-burgundy mx-auto" />
                    <p className="text-sm text-slate-900">{file.name}</p>
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
                    <HiUpload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      <span className="text-burgundy font-medium">Klik untuk upload</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PDF atau Word</p>
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
                <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3 mb-3">
                  <HiXCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!file || !judul.trim() || uploading}
                className="w-full px-4 py-2.5 bg-burgundy text-white text-sm rounded-xl hover:bg-burgundy-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {uploading ? 'Mengupload...' : 'Upload Panduan'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className={isAdmin ? 'lg:col-span-1' : 'lg:col-span-3'}>
        <div className="bg-white rounded-xl border border-slate-200/70 p-5">
          <h3 className="text-sm font-medium text-slate-900 mb-3">Riwayat Panduan</h3>

          {!isAdmin && guidelines.length === 0 && (
            <div className="flex flex-col items-center py-6 text-slate-400">
              <HiDocumentText className="w-8 h-8 mb-2" />
              <p className="text-xs">Belum ada panduan yang diupload admin</p>
            </div>
          )}

          {guidelines.length === 0 && isAdmin && (
            <p className="text-xs text-slate-400 text-center py-4">Belum ada panduan</p>
          )}

          {guidelines.length > 0 && (
            <div className="space-y-2">
              {guidelines.map((g) => (
                <div
                  key={g.id}
                   className={`flex items-start gap-2.5 p-2.5 rounded-lg text-sm ${
                    g.aktif ? 'bg-burgundy/10 ring-1 ring-burgundy/10' : 'bg-slate-50'
                  }`}
                >
                  {g.aktif
                    ? <HiCheckCircle className="w-4 h-4 text-burgundy mt-0.5 shrink-0" />
                    : <HiDocumentText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  }
                  <div className="min-w-0">
                    <p className="text-xs text-slate-900 truncate">{g.judul}</p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(g.created_at).toLocaleDateString('id-ID')}
                      {g.aktif && <span className="text-burgundy ml-1">(aktif)</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
