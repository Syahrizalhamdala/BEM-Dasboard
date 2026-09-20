import { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiClock, HiLocationMarker, HiPencil, HiTrash, HiX, HiQrcode, HiEye } from 'react-icons/hi';
import { Card, Badge } from '../../components/ui';
import AgendaQRCodeModal from '../../components/agenda/AgendaQRCodeModal';
import { useAuth } from '../../context/AuthContext';
import { getAgenda, tambahAgenda, updateAgenda, deleteAgenda } from '../../api/agendaApi';

const AGENDA_STATUS = (tanggal) => {
  if (!tanggal) return { label: 'Akan Datang', variant: 'info' };
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const tgl = new Date(tanggal);
  const diff = tgl.getTime() - now.getTime();
  if (diff < 0) return { label: 'Selesai', variant: 'neutral' };
  if (diff < 86400000 * 3) return { label: 'Dalam 3 Hari', variant: 'warning' };
  return { label: 'Akan Datang', variant: 'info' };
};

const QR_STATUS_MAP = {
  active: { label: 'Aktif', variant: 'success' },
  expired: { label: 'Expired', variant: 'neutral' },
  inactive: { label: 'Belum Dimulai', variant: 'warning' },
};

export default function Agenda() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [agendaList, setAgendaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({ open: false, mode: 'add' });
  const [form, setForm] = useState({
    agenda: '', tanggal: '', waktu_mulai: '', waktu_selesai: '',
    tempat: '', pemimpin: '', deskripsi: '', lingkup: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [qrModalAgenda, setQrModalAgenda] = useState(null);
  const [detailModalAgenda, setDetailModalAgenda] = useState(null);

  const fetchAgenda = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAgenda();
      setAgendaList(data);
    } catch {
      setError('Gagal memuat data agenda. Pastikan server backend berjalan.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAgenda(); }, [fetchAgenda]);

  const openAddModal = () => {
    setForm({ agenda: '', tanggal: '', waktu_mulai: '', waktu_selesai: '', tempat: '', pemimpin: '', deskripsi: '', lingkup: '' });
    setFormErrors({});
    setSelectedId(null);
    setModal({ open: true, mode: 'add' });
  };

  const openEditModal = (agenda) => {
    setForm({
      agenda: agenda.agenda || '',
      tanggal: agenda.tanggal || '',
      waktu_mulai: agenda.waktu_mulai || '',
      waktu_selesai: agenda.waktu_selesai || '',
      tempat: agenda.tempat || '',
      pemimpin: agenda.pemimpin || '',
      deskripsi: agenda.deskripsi || '',
      lingkup: agenda.lingkup || '',
    });
    setFormErrors({});
    setSelectedId(agenda.id);
    setModal({ open: true, mode: 'edit' });
  };

  const closeModal = () => {
    setModal({ open: false, mode: 'add' });
    setForm({ agenda: '', tanggal: '', waktu_mulai: '', waktu_selesai: '', tempat: '', pemimpin: '', deskripsi: '', lingkup: '' });
    setFormErrors({});
    setSelectedId(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!form.agenda.trim()) errors.agenda = 'Nama agenda harus diisi';
    if (!form.tanggal) errors.tanggal = 'Tanggal harus diisi';
    if (!form.waktu_mulai) errors.waktu_mulai = 'Waktu mulai harus diisi';
    if (!form.tempat.trim()) errors.tempat = 'Tempat harus diisi';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    setFormErrors({});
    try {
      const payload = {
        agenda: form.agenda.trim(),
        tanggal: form.tanggal,
        waktu_mulai: form.waktu_mulai,
        waktu_selesai: form.waktu_selesai || null,
        tempat: form.tempat.trim(),
        pemimpin: form.pemimpin.trim() || null,
        deskripsi: form.deskripsi.trim() || null,
        lingkup: form.lingkup || null,
      };
      if (modal.mode === 'edit' && selectedId) {
        await updateAgenda(selectedId, payload);
      } else {
        await tambahAgenda(payload);
      }
      closeModal();
      await fetchAgenda();
    } catch (err) {
      setFormErrors((prev) => ({ ...prev, _general: err.message || 'Gagal menyimpan data' }));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus agenda "${nama}"?`)) return;
    setDeletingId(id);
    try {
      await deleteAgenda(id);
      await fetchAgenda();
    } catch {
      alert('Gagal menghapus agenda');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (tanggal) => {
    if (!tanggal) return '-';
    const d = new Date(tanggal);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-[14px] animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[15px] font-medium text-slate-900">Agenda</h1>
          <p className="text-xs text-slate-600 mt-0.5">Kelola agenda kegiatan BEM</p>
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-white rounded-lg text-xs font-medium hover:bg-burgundy-dark transition-colors"
          >
            <HiPlus className="w-3.5 h-3.5" />
            Tambah Agenda
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
          {agendaList.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Belum ada data agenda.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left py-2.5 px-4 text-[11px] font-medium text-slate-500">Judul</th>
                    <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Tanggal</th>
                    <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Status</th>
                    <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">QR Status</th>
                    <th className="text-right py-2.5 px-4 text-[11px] font-medium text-slate-500">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {agendaList.map((agenda) => {
                    const aStatus = AGENDA_STATUS(agenda.tanggal);
                    const qrStatus = QR_STATUS_MAP[agenda.qr_status] || QR_STATUS_MAP.inactive;

                    return (
                      <tr key={agenda.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm font-medium text-slate-900">{agenda.agenda}</p>
                            {agenda.tempat && (
                              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                <HiLocationMarker className="w-3 h-3 shrink-0" />
                                {agenda.tempat}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-700">{formatDate(agenda.tanggal)}</span>
                            {agenda.waktu_mulai && (
                              <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <HiClock className="w-3 h-3" />
                                {agenda.waktu_mulai}{agenda.waktu_selesai ? ` - ${agenda.waktu_selesai}` : ''}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={aStatus.variant}>{aStatus.label}</Badge>
                        </td>
                        <td className="py-3 px-3">
                          <Badge variant={qrStatus.variant} dot>{qrStatus.label}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-0.5">
                            <button
                              onClick={() => setDetailModalAgenda(agenda)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Lihat Detail"
                            >
                              <HiEye className="w-3.5 h-3.5" />
                            </button>
                            {isAdmin && (
                              <>
                                <button
                                  onClick={() => openEditModal(agenda)}
                                  className="p-1.5 rounded-md text-slate-400 hover:text-burgundy hover:bg-burgundy/10 transition-colors"
                                  title="Edit"
                                >
                                  <HiPencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setQrModalAgenda(agenda)}
                                  className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                                  title="QR Code"
                                >
                                  <HiQrcode className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(agenda.id, agenda.agenda)}
                                  disabled={deletingId === agenda.id}
                                  className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                                  title="Hapus"
                                >
                                  {deletingId === agenda.id ? (
                                    <div className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <HiTrash className="w-3.5 h-3.5" />
                                  )}
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
      )}

      {detailModalAgenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetailModalAgenda(null)} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-slate-900">Detail Agenda</h2>
              <button
                onClick={() => setDetailModalAgenda(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">Judul</p>
                <p className="text-sm text-slate-900">{detailModalAgenda.agenda}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Tanggal</p>
                  <p className="text-sm text-slate-900">{formatDate(detailModalAgenda.tanggal)}</p>
                </div>
                {detailModalAgenda.lingkup && (
                  <div>
                    <p className="text-[11px] font-medium text-slate-500 mb-0.5">Lingkup</p>
                    <p className="text-sm text-slate-900">{detailModalAgenda.lingkup}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Waktu Mulai</p>
                  <p className="text-sm text-slate-900">{detailModalAgenda.waktu_mulai || '-'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Waktu Selesai</p>
                  <p className="text-sm text-slate-900">{detailModalAgenda.waktu_selesai || '-'}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-medium text-slate-500 mb-0.5">Tempat</p>
                <p className="text-sm text-slate-900">{detailModalAgenda.tempat || '-'}</p>
              </div>

              {detailModalAgenda.pemimpin && (
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Pemimpin</p>
                  <p className="text-sm text-slate-900">{detailModalAgenda.pemimpin}</p>
                </div>
              )}

              {detailModalAgenda.deskripsi && (
                <div>
                  <p className="text-[11px] font-medium text-slate-500 mb-0.5">Deskripsi</p>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{detailModalAgenda.deskripsi}</p>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    const a = detailModalAgenda;
                    setDetailModalAgenda(null);
                    setQrModalAgenda(a);
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-burgundy/10 text-burgundy rounded-lg text-xs font-medium hover:bg-burgundy/20 transition-colors"
                >
                  <HiQrcode className="w-3.5 h-3.5" />
                  Lihat QR Code
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {qrModalAgenda && (
        <AgendaQRCodeModal
          agenda={qrModalAgenda}
          onClose={() => setQrModalAgenda(null)}
          onUpdate={fetchAgenda}
        />
      )}

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-slate-900">
                {modal.mode === 'edit' ? 'Edit Agenda' : 'Tambah Agenda'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Nama Agenda</label>
                <input
                  type="text"
                  name="agenda"
                  value={form.agenda}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${
                    formErrors.agenda ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.agenda && <p className="text-[#FF6B6B] text-[11px] mt-1">{formErrors.agenda}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    name="tanggal"
                    value={form.tanggal}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${
                      formErrors.tanggal ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.tanggal && <p className="text-[#FF6B6B] text-[11px] mt-1">{formErrors.tanggal}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Lingkup</label>
                  <select
                    name="lingkup"
                    value={form.lingkup}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                  >
                    <option value="">Pilih Lingkup</option>
                    <option value="Internal">Internal</option>
                    <option value="Eksternal">Eksternal</option>
                    <option value="Umum">Umum</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Waktu Mulai</label>
                  <input
                    type="time"
                    name="waktu_mulai"
                    value={form.waktu_mulai}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${
                      formErrors.waktu_mulai ? 'border-red-400' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.waktu_mulai && <p className="text-[#FF6B6B] text-[11px] mt-1">{formErrors.waktu_mulai}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Waktu Selesai</label>
                  <input
                    type="time"
                    name="waktu_selesai"
                    value={form.waktu_selesai}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tempat</label>
                <input
                  type="text"
                  name="tempat"
                  value={form.tempat}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${
                    formErrors.tempat ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.tempat && <p className="text-[#FF6B6B] text-[11px] mt-1">{formErrors.tempat}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Pemimpin / Penanggung Jawab</label>
                <input
                  type="text"
                  name="pemimpin"
                  value={form.pemimpin}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Deskripsi</label>
                <textarea
                  name="deskripsi"
                  rows={3}
                  value={form.deskripsi}
                  onChange={handleFormChange}
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
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                      Menyimpan...
                    </>
                  ) : modal.mode === 'edit' ? (
                    'Simpan Perubahan'
                  ) : (
                    'Tambah Agenda'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
