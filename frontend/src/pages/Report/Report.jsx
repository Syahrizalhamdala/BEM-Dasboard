import { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiDocumentText, HiDownload, HiEye, HiTrash, HiX, HiUpload, HiPaperClip } from 'react-icons/hi';
import { Card, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { getLaporan, tambahLaporan, deleteLaporan, downloadLaporan } from '../../api/laporanApi';

const tipeConfig = {
  'Bulanan': { icon: HiDocumentText, color: 'text-burgundy', bg: 'bg-burgundy/10' },
  'Kegiatan': { icon: HiDocumentText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  'Keuangan': { icon: HiDocumentText, color: 'text-purple-600', bg: 'bg-purple-50' },
  'Proposal': { icon: HiDocumentText, color: 'text-amber-600', bg: 'bg-amber-50' },
  'Evaluasi': { icon: HiDocumentText, color: 'text-rose-600', bg: 'bg-rose-50' },
};

const fileTypeIcons = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
};

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatFileSize(bytes) {
  if (!bytes) return '-';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function Report() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [laporanList, setLaporanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({ open: false, mode: 'add' });
  const [form, setForm] = useState({
    judul: '', tipe: 'Bulanan', status: 'Draft',
    tanggal: '', deskripsi: '', file: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [detailLaporan, setDetailLaporan] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLaporan();
      setLaporanList(data);
    } catch {
      setError('Gagal memuat data laporan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openAddModal = () => {
    setForm({ judul: '', tipe: 'Bulanan', status: 'Draft', tanggal: '', deskripsi: '', file: null });
    setFormErrors({});
    setModal({ open: true, mode: 'add' });
  };

  const closeModal = () => {
    setModal({ open: false, mode: 'add' });
    setForm({ judul: '', tipe: 'Bulanan', status: 'Draft', tanggal: '', deskripsi: '', file: null });
    setFormErrors({});
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
      setForm((prev) => ({ ...prev, file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.judul.trim()) errors.judul = 'Judul harus diisi';
    if (!form.tanggal) errors.tanggal = 'Tanggal harus diisi';
    if (!form.file && modal.mode === 'add') errors.file = 'File harus dipilih';
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    setSaving(true);
    setFormErrors({});
    try {
      const fd = new FormData();
      fd.append('judul', form.judul.trim());
      fd.append('tipe', form.tipe);
      fd.append('status', form.status);
      fd.append('tanggal', form.tanggal);
      if (form.deskripsi.trim()) fd.append('deskripsi', form.deskripsi.trim());
      if (form.file) fd.append('file', form.file);

      await tambahLaporan(fd);
      closeModal();
      await fetchData();
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, _general: err.message || 'Gagal menyimpan' }));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, judul) => {
    if (!window.confirm(`Yakin ingin menghapus laporan "${judul}"?`)) return;
    setDeletingId(id);
    try {
      await deleteLaporan(id);
      await fetchData();
    } catch {
      alert('Gagal menghapus laporan');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (id) => {
    try {
      await downloadLaporan(id);
    } catch {
      alert('Gagal mengunduh file');
    }
  };

  return (
    <div className="space-y-[14px] animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[15px] font-medium text-slate-900">Laporan</h1>
          <p className="text-xs text-slate-600 mt-0.5">Kelola laporan kegiatan dan keuangan</p>
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-white rounded-lg text-xs font-medium hover:bg-burgundy-dark transition-colors"
          >
            <HiPlus className="w-3.5 h-3.5" />
            Upload Laporan
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-burgundy border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-24">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <Card padding={false}>
          {laporanList.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Belum ada data laporan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2.5 px-4 text-[11px] font-medium text-slate-500">Judul</th>
                    <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Tipe</th>
                    <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">File</th>
                    <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Status</th>
                    <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Tanggal</th>
                    <th className="text-right py-2.5 px-4 text-[11px] font-medium text-slate-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {laporanList.map((laporan) => {
                    const config = tipeConfig[laporan.tipe] || tipeConfig['Bulanan'];
                    const Icon = config.icon;
                    const ext = fileTypeIcons[laporan.file_type] || laporan.file_name?.split('.').pop()?.toUpperCase() || 'FILE';

                    return (
                      <tr key={laporan.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 ${config.bg} rounded-lg flex items-center justify-center shrink-0`}>
                              <Icon className={`${config.color} w-4 h-4`} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{laporan.judul}</p>
                              <p className="text-[10px] text-slate-400">{laporan.pembuat}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs text-slate-700">{laporan.tipe}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded">
                            <HiPaperClip className="w-3 h-3" />
                            {ext}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1.5">{formatFileSize(laporan.file_size)}</span>
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            variant={
                              laporan.status === 'Selesai' ? 'success' :
                              laporan.status === 'Proses' ? 'warning' : 'neutral'
                            }
                            dot
                          >
                            {laporan.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-600">{formatDate(laporan.tanggal)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-0.5">
                            <button
                              onClick={() => setDetailLaporan(laporan)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Lihat Detail"
                            >
                              <HiEye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDownload(laporan.id)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-burgundy hover:bg-burgundy/10 transition-colors"
                              title="Download"
                            >
                              <HiDownload className="w-3.5 h-3.5" />
                            </button>
                            {isAdmin && (
                              <button
                                onClick={() => handleDelete(laporan.id, laporan.judul)}
                                disabled={deletingId === laporan.id}
                                className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                                title="Hapus"
                              >
                                {deletingId === laporan.id ? (
                                  <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <HiTrash className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {detailLaporan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetailLaporan(null)} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-slate-900">Detail Laporan</h2>
              <button onClick={() => setDetailLaporan(null)} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <HiX className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">Judul</p>
                <p className="text-sm text-slate-900">{detailLaporan.judul}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Tipe</p>
                  <p className="text-sm text-slate-900">{detailLaporan.tipe}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Status</p>
                  <Badge variant={
                    detailLaporan.status === 'Selesai' ? 'success' :
                    detailLaporan.status === 'Proses' ? 'warning' : 'neutral'
                  } dot>{detailLaporan.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Tanggal</p>
                  <p className="text-sm text-slate-900">{formatDate(detailLaporan.tanggal)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Pembuat</p>
                  <p className="text-sm text-slate-900">{detailLaporan.pembuat}</p>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">File</p>
                <p className="text-sm text-slate-900">{detailLaporan.file_name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{formatFileSize(detailLaporan.file_size)}</p>
              </div>
              {detailLaporan.deskripsi && (
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Deskripsi</p>
                  <p className="text-sm text-slate-700">{detailLaporan.deskripsi}</p>
                </div>
              )}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => { handleDownload(detailLaporan.id); setDetailLaporan(null); }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-burgundy text-white rounded-lg text-xs font-medium hover:bg-burgundy-dark transition-colors"
                >
                  <HiDownload className="w-3.5 h-3.5" />
                  Download File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-slate-900">Upload Laporan</h2>
              <button onClick={closeModal} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <HiX className="w-4 h-4" />
              </button>
            </div>

            {formErrors._general && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                {formErrors._general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Judul Laporan</label>
                <input
                  type="text"
                  name="judul"
                  value={form.judul}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${formErrors.judul ? 'border-red-400' : 'border-slate-200'}`}
                />
                {formErrors.judul && <p className="text-[#FF6B6B] text-[11px] mt-1">{formErrors.judul}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tipe</label>
                  <select
                    name="tipe"
                    value={form.tipe}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                  >
                    <option value="Bulanan">Bulanan</option>
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Keuangan">Keuangan</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Evaluasi">Evaluasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Proses">Proses</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${formErrors.tanggal ? 'border-red-400' : 'border-slate-200'}`}
                />
                {formErrors.tanggal && <p className="text-[#FF6B6B] text-[11px] mt-1">{formErrors.tanggal}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">File (PDF, DOC, DOCX, XLS, XLSX — max 10MB)</label>
                <div className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${form.file ? 'border-blue-300 bg-blue-50/30' : 'border-slate-200 hover:border-slate-300'}`}>
                  {form.file ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                          <HiPaperClip className="w-4 h-4 text-burgundy/80 shrink-0" />
                        <span className="text-sm text-slate-900 truncate">{form.file.name}</span>
                        <span className="text-xs text-slate-400">({formatFileSize(form.file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, file: null }))}
                        className="p-1 text-slate-400 hover:text-red-500"
                      >
                        <HiX className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center cursor-pointer">
                      <HiUpload className="w-6 h-6 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500">Klik untuk pilih file</span>
                      <input
                        type="file"
                        name="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {formErrors.file && <p className="text-[#FF6B6B] text-[11px] mt-1">{formErrors.file}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Deskripsi (opsional)</label>
                <textarea
                  name="deskripsi"
                  rows={3}
                  value={form.deskripsi}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-3 py-2 bg-burgundy hover:bg-burgundy-dark text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" /> Menyimpan...</>
                  ) : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
