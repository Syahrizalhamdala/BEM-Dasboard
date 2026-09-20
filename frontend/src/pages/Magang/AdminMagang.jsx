import { useState, useEffect, useCallback } from 'react';
import {
  HiPlus, HiPencil, HiTrash, HiX, HiEye, HiDownload,
  HiOutlineBriefcase, HiOutlineUsers, HiOutlineCheckCircle,
  HiOutlineXCircle, HiOutlineClock,
} from 'react-icons/hi';
import { Card, Badge } from '../../components/ui';
import {
  getAdminMagang, createMagang, updateMagang, deleteMagang,
  getMagangApplications, updateApplicationStatus,
} from '../../api/magangApi';

const STATUS_BADGE = {
  dibuka: { label: 'Dibuka', variant: 'success' },
  ditutup: { label: 'Ditutup', variant: 'neutral' },
  pending: { label: 'Pending', variant: 'warning' },
  diterima: { label: 'Diterima', variant: 'success' },
  ditolak: { label: 'Ditolak', variant: 'neutral' },
};

export default function AdminMagang() {
  const [tab, setTab] = useState('magang');
  const [magangList, setMagangList] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({ open: false, mode: 'add' });
  const [form, setForm] = useState({
    judul_magang: '', deskripsi: '', persyaratan: '', benefit: '',
    durasi: '', lokasi: '', deadline: '', status: 'dibuka', kontak: '', gambar: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [detailMagang, setDetailMagang] = useState(null);
  const [appFilter, setAppFilter] = useState({ magang_id: '', status: '' });

  const fetchMagang = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminMagang();
      setMagangList(data);
    } catch {
      setError('Gagal memuat data magang.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMagangApplications(appFilter);
      setApplications(data);
    } catch {
      setError('Gagal memuat data pendaftaran.');
    } finally {
      setLoading(false);
    }
  }, [appFilter]);

  useEffect(() => {
    if (tab === 'magang') fetchMagang();
    else fetchApplications();
  }, [tab, fetchMagang, fetchApplications]);

  const openAddModal = () => {
    setForm({
      judul_magang: '', deskripsi: '', persyaratan: '', benefit: '',
      durasi: '', lokasi: '', deadline: '', status: 'dibuka', kontak: '', gambar: null,
    });
    setFormErrors({});
    setSelectedId(null);
    setModal({ open: true, mode: 'add' });
  };

  const openEditModal = (magang) => {
    setForm({
      judul_magang: magang.judul_magang || '',
      deskripsi: magang.deskripsi || '',
      persyaratan: magang.persyaratan || '',
      benefit: magang.benefit || '',
      durasi: magang.durasi || '',
      lokasi: magang.lokasi || '',
      deadline: magang.deadline || '',
      status: magang.status || 'dibuka',
      kontak: magang.kontak || '',
      gambar: null,
    });
    setFormErrors({});
    setSelectedId(magang.id);
    setModal({ open: true, mode: 'edit' });
  };

  const closeModal = () => {
    setModal({ open: false, mode: 'add' });
    setFormErrors({});
    setSelectedId(null);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'gambar') {
      setForm((prev) => ({ ...prev, gambar: files[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.judul_magang.trim()) errors.judul_magang = 'Judul harus diisi';
    if (!form.deskripsi.trim()) errors.deskripsi = 'Deskripsi harus diisi';
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    setSaving(true);
    setFormErrors({});
    try {
      const fd = new FormData();
      fd.append('judul_magang', form.judul_magang);
      fd.append('deskripsi', form.deskripsi);
      fd.append('status', form.status);
      if (form.persyaratan) fd.append('persyaratan', form.persyaratan);
      if (form.benefit) fd.append('benefit', form.benefit);
      if (form.durasi) fd.append('durasi', form.durasi);
      if (form.lokasi) fd.append('lokasi', form.lokasi);
      if (form.deadline) fd.append('deadline', form.deadline);
      if (form.kontak) fd.append('kontak', form.kontak);
      if (form.gambar) fd.append('gambar', form.gambar);

      if (modal.mode === 'edit' && selectedId) {
        fd.append('_method', 'PUT');
        await updateMagang(selectedId, fd);
      } else {
        await createMagang(fd);
      }
      closeModal();
      await fetchMagang();
    } catch (err) {
      setFormErrors({ _general: err.message || 'Gagal menyimpan data' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, judul) => {
    if (!window.confirm(`Yakin ingin menghapus "${judul}"?`)) return;
    try {
      await deleteMagang(id);
      await fetchMagang();
    } catch {
      alert('Gagal menghapus data');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      await fetchApplications();
    } catch {
      alert('Gagal mengubah status');
    }
  };

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-[14px] animate-fade-in">
      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
          <button
            onClick={() => setTab('magang')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === 'magang' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <HiOutlineBriefcase className="w-3.5 h-3.5 inline-block mr-1" />
            Program Magang
          </button>
          <button
            onClick={() => setTab('applications')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              tab === 'applications' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <HiOutlineUsers className="w-3.5 h-3.5 inline-block mr-1" />
            Pendaftar
          </button>
        </div>
        {tab === 'magang' && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-white rounded-lg text-xs font-medium hover:bg-burgundy-dark transition-colors"
          >
            <HiPlus className="w-3.5 h-3.5" />
            Tambah Magang
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="w-6 h-6 border-2 border-burgundy border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center justify-center py-24">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Tab: Magang List */}
      {!loading && !error && tab === 'magang' && (
        <Card padding={false}>
          {magangList.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Belum ada data program magang.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2.5 px-4 text-[11px] font-medium text-slate-500">Judul</th>
                    <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Lokasi</th>
                    <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Deadline</th>
                    <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Status</th>
                    <th className="text-right py-2.5 px-4 text-[11px] font-medium text-slate-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {magangList.map((m) => {
                    const s = STATUS_BADGE[m.status] || STATUS_BADGE.dibuka;
                    return (
                      <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium text-slate-900">{m.judul_magang}</p>
                          {m.durasi && <p className="text-xs text-slate-400 mt-0.5">{m.durasi}</p>}
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-600">{m.lokasi || '-'}</td>
                        <td className="py-3 px-3 text-xs text-slate-600">{formatDate(m.deadline)}</td>
                        <td className="py-3 px-3"><Badge variant={s.variant}>{s.label}</Badge></td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-0.5">
                            <button
                              onClick={() => setDetailMagang(m)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Lihat Detail"
                            >
                              <HiEye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => openEditModal(m)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-burgundy hover:bg-burgundy/10 transition-colors"
                              title="Edit"
                            >
                              <HiPencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(m.id, m.judul_magang)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Hapus"
                            >
                              <HiTrash className="w-3.5 h-3.5" />
                            </button>
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

      {/* Tab: Applications */}
      {!loading && !error && tab === 'applications' && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={appFilter.magang_id}
              onChange={(e) => setAppFilter((p) => ({ ...p, magang_id: e.target.value }))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none"
            >
              <option value="">Semua Magang</option>
              {magangList.map((m) => (
                <option key={m.id} value={m.id}>{m.judul_magang}</option>
              ))}
            </select>
            <select
              value={appFilter.status}
              onChange={(e) => setAppFilter((p) => ({ ...p, status: e.target.value }))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 outline-none"
            >
              <option value="">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="diterima">Diterima</option>
              <option value="ditolak">Ditolak</option>
            </select>
          </div>

          <Card padding={false}>
            {applications.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400">
                Belum ada pendaftaran.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2.5 px-4 text-[11px] font-medium text-slate-500">Nama</th>
                      <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Kontak</th>
                      <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Magang</th>
                      <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Status</th>
                      <th className="text-right py-2.5 px-4 text-[11px] font-medium text-slate-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => {
                      const s = STATUS_BADGE[app.status_pendaftaran] || STATUS_BADGE.pending;
                      return (
                        <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <p className="text-sm font-medium text-slate-900">{app.nama_lengkap}</p>
                            {app.nim && <p className="text-[11px] text-slate-400">{app.nim}</p>}
                          </td>
                          <td className="py-3 px-3">
                            <p className="text-xs text-slate-600">{app.email}</p>
                            {app.no_hp && <p className="text-[11px] text-slate-400">{app.no_hp}</p>}
                          </td>
                          <td className="py-3 px-3 text-xs text-slate-600">
                            {app.magang?.judul_magang || '-'}
                          </td>
                          <td className="py-3 px-3"><Badge variant={s.variant}>{s.label}</Badge></td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-0.5">
                              {app.cv_path && (
                                <a
                                  href={`${import.meta.env.VITE_API_URL}/admin/magang-applications/${app.id}/download-cv`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                  title="Download CV"
                                >
                                  <HiDownload className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {app.status_pendaftaran === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(app.id, 'diterima')}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                                    title="Terima"
                                  >
                                    <HiOutlineCheckCircle className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(app.id, 'ditolak')}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="Tolak"
                                  >
                                    <HiOutlineXCircle className="w-3.5 h-3.5" />
                                  </button>
                                </>
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
        </>
      )}

      {/* Detail Modal */}
      {detailMagang && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetailMagang(null)} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-slate-900">Detail Program Magang</h2>
              <button
                onClick={() => setDetailMagang(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">Judul</p>
                <p className="text-sm text-slate-900 font-medium">{detailMagang.judul_magang}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Durasi</p>
                  <p className="text-sm text-slate-900">{detailMagang.durasi || '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Lokasi</p>
                  <p className="text-sm text-slate-900">{detailMagang.lokasi || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Deadline</p>
                  <p className="text-sm text-slate-900">{formatDate(detailMagang.deadline)}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Status</p>
                  <Badge variant={STATUS_BADGE[detailMagang.status]?.variant}>{STATUS_BADGE[detailMagang.status]?.label}</Badge>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">Deskripsi</p>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{detailMagang.deskripsi}</p>
              </div>
              {detailMagang.persyaratan && (
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Persyaratan</p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{detailMagang.persyaratan}</p>
                </div>
              )}
              {detailMagang.benefit && (
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Benefit</p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{detailMagang.benefit}</p>
                </div>
              )}
              {detailMagang.kontak && (
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Kontak</p>
                  <p className="text-sm text-slate-900">{detailMagang.kontak}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-slate-900">
                {modal.mode === 'edit' ? 'Edit Program Magang' : 'Tambah Program Magang'}
              </h2>
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Judul Magang <span className="text-red-400">*</span></label>
                <input
                  type="text" name="judul_magang" value={form.judul_magang} onChange={handleFormChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${
                    formErrors.judul_magang ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.judul_magang && <p className="text-red-500 text-[11px] mt-1">{formErrors.judul_magang}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Deskripsi <span className="text-red-400">*</span></label>
                <textarea
                  name="deskripsi" rows={3} value={form.deskripsi} onChange={handleFormChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy resize-none ${
                    formErrors.deskripsi ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.deskripsi && <p className="text-red-500 text-[11px] mt-1">{formErrors.deskripsi}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Durasi</label>
                  <input
                    type="text" name="durasi" value={form.durasi} onChange={handleFormChange}
                    placeholder="3 Bulan"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Lokasi</label>
                  <input
                    type="text" name="lokasi" value={form.lokasi} onChange={handleFormChange}
                    placeholder="Remote / Kantor BEM"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Deadline</label>
                  <input
                    type="date" name="deadline" value={form.deadline} onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
                  <select
                    name="status" value={form.status} onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                  >
                    <option value="dibuka">Dibuka</option>
                    <option value="ditutup">Ditutup</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Persyaratan</label>
                <textarea
                  name="persyaratan" rows={3} value={form.persyaratan} onChange={handleFormChange}
                  placeholder="Tulis persyaratan..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Benefit</label>
                <textarea
                  name="benefit" rows={3} value={form.benefit} onChange={handleFormChange}
                  placeholder="Tulis benefit untuk peserta magang..."
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Kontak</label>
                  <input
                    type="text" name="kontak" value={form.kontak} onChange={handleFormChange}
                    placeholder="Email / WhatsApp"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Gambar</label>
                  <input
                    type="file" name="gambar" accept="image/*" onChange={handleFormChange}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-2 file:rounded-md file:border-0 file:text-[11px] file:font-medium file:bg-burgundy/10 file:text-burgundy hover:file:bg-burgundy/20 file:cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button" onClick={closeModal}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit" disabled={saving}
                  className="flex-1 px-3 py-2 bg-burgundy hover:bg-burgundy-dark text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                      Menyimpan...
                    </>
                  ) : modal.mode === 'edit' ? 'Simpan Perubahan' : 'Tambah Magang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
