import { useState, useEffect, useMemo } from 'react';
import { HiPlus, HiSearch, HiPencil, HiTrash, HiX, HiCheckCircle, HiBan } from 'react-icons/hi';
import { Avatar, Badge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { getAnggota, tambahAnggota, updateAnggota, deleteAnggota, toggleStatusAnggota } from '../../api/anggotaApi';

const PER_PAGE = 10;

const emptyForm = { nama: '', nim: '', jabatan: '', angkatan: '' };

export default function Anggota() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [anggotaList, setAnggotaList] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modal, setModal] = useState({ open: false, mode: 'add' });
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const fetchAnggota = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnggota();
      setAnggotaList(data);
    } catch {
      setError('Gagal memuat data anggota. Pastikan server backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnggota();
  }, []);

  const filtered = useMemo(() => {
    return anggotaList.filter((a) => {
      const matchSearch =
        !search ||
        a.nama?.toLowerCase().includes(search.toLowerCase()) ||
        a.nim?.toLowerCase().includes(search.toLowerCase()) ||
        a.jabatan?.toLowerCase().includes(search.toLowerCase());
      return matchSearch;
    });
  }, [anggotaList, search]);

  const totalPage = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPage);
  const paginated = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const totalAktif = anggotaList.filter(a => a.status !== 'nonaktif').length;

  useEffect(() => {
    setPage(1);
  }, [search]);

  const statCards = [
    { label: 'Total Anggota', value: anggotaList.length },
    { label: 'Aktif', value: totalAktif },
    { label: 'Nonaktif', value: anggotaList.length - totalAktif },
  ];

  const openAddModal = () => {
    setForm(emptyForm);
    setFormErrors({});
    setSelectedId(null);
    setModal({ open: true, mode: 'add' });
  };

  const openEditModal = (anggota) => {
    setForm({
      nama: anggota.nama || '',
      nim: anggota.nim || '',
      jabatan: anggota.jabatan || '',
      angkatan: anggota.angkatan || '',
    });
    setFormErrors({});
    setSelectedId(anggota.id);
    setModal({ open: true, mode: 'edit' });
  };

  const closeModal = () => {
    setModal({ open: false, mode: 'add' });
    setForm(emptyForm);
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
    if (!form.nama.trim()) errors.nama = 'Nama harus diisi';
    if (!form.nim.trim()) errors.nim = 'NIM harus diisi';
    if (!form.jabatan.trim()) errors.jabatan = 'Jabatan harus diisi';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    setFormErrors({});
    try {
      if (modal.mode === 'edit' && selectedId) {
        await updateAnggota(selectedId, form);
      } else {
        await tambahAnggota(form);
      }
      closeModal();
      await fetchAnggota();
    } catch (err) {
      const msg = err.message || 'Gagal menyimpan data';
      if (msg.includes('nim')) {
        setFormErrors((prev) => ({ ...prev, nim: 'NIM sudah terdaftar' }));
      } else {
        setFormErrors((prev) => ({ ...prev, _general: msg }));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, nama) => {
    if (!window.confirm(`Yakin ingin menghapus ${nama}?`)) return;
    setDeletingId(id);
    try {
      await deleteAnggota(id);
      await fetchAnggota();
    } catch {
      alert('Gagal menghapus anggota');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (anggota) => {
    if (!window.confirm(`Yakin ingin ${anggota.status === 'aktif' ? 'menonaktifkan' : 'mengaktifkan'} ${anggota.nama}?`)) return;
    setTogglingId(anggota.id);
    try {
      await toggleStatusAnggota(anggota.id);
      await fetchAnggota();
    } catch {
      alert('Gagal mengubah status anggota');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-[14px] animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[15px] font-medium text-slate-900">Anggota</h1>
          <p className="text-xs text-slate-600 mt-0.5">Kelola data anggota BEM</p>
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-white rounded-lg text-xs font-medium hover:bg-burgundy-dark transition-colors"
          >
            <HiPlus className="w-3.5 h-3.5" />
            Tambah Anggota
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200/70 p-3">
            <p className="text-xs text-slate-600 mb-0.5">{s.label}</p>
            <p className="text-xl font-medium text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 p-3 border-b border-slate-200 flex-wrap">
          <div           className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg flex-1 min-w-[180px] focus-within:ring-2 focus-within:ring-burgundy/20 focus-within:bg-white transition-all">
            <HiSearch className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari anggota..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-full text-slate-700 placeholder-slate-400"
            />
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-6 h-6 border-2 border-burgundy border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-16">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-3 text-xs font-medium text-slate-800 bg-white sticky top-0">Nama</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-slate-800 bg-white sticky top-0">NIM</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-slate-800 bg-white sticky top-0">Jabatan</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-slate-800 bg-white sticky top-0">Angkatan</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-slate-800 bg-white sticky top-0">Status</th>
                    <th className="text-right py-3 px-3 text-xs font-medium text-slate-800 bg-white sticky top-0">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-xs text-slate-400">
                        Tidak ada anggota ditemukan
                      </td>
                    </tr>
                  )}
                  {paginated.map((anggota, idx) => (
                    <tr
                      key={anggota.id}
                      className={`border-b border-slate-100 transition-colors hover:bg-slate-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={anggota.nama} size="sm" />
                          <span className="text-sm text-slate-900">{anggota.nama}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-sm text-slate-700">{anggota.nim}</td>
                      <td className="py-3 px-3 text-sm text-slate-700">{anggota.jabatan}</td>
                      <td className="py-3 px-3 text-sm text-slate-700">{anggota.angkatan}</td>
                      <td className="py-3 px-3">
                        <Badge variant={anggota.status === 'aktif' ? 'success' : 'danger'}>
                          {anggota.status || 'aktif'}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-0.5">
                          {isAdmin && (
                            <>
                              <button
                                onClick={() => handleToggleStatus(anggota)}
                                disabled={togglingId === anggota.id}
                                className={`p-1.5 rounded-md transition-colors disabled:opacity-40 ${
                                  anggota.status === 'aktif'
                                    ? 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                                    : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                                }`}
                                title={anggota.status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                              >
                                {togglingId === anggota.id ? (
                                  <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                                ) : anggota.status === 'aktif' ? (
                                  <HiBan className="w-3.5 h-3.5" />
                                ) : (
                                  <HiCheckCircle className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                onClick={() => openEditModal(anggota)}
                                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              >
                                <HiPencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(anggota.id, anggota.nama)}
                                disabled={deletingId === anggota.id}
                                className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
                              >
                                {deletingId === anggota.id ? (
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
                  ))}
                </tbody>
              </table>
            </div>

            {totalPage > 1 && (
              <div className="flex items-center justify-between px-3 py-3 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Menampilkan <span className="font-medium text-slate-700">{(safePage - 1) * PER_PAGE + 1}</span>&ndash;
                  <span className="font-medium text-slate-700">{Math.min(safePage * PER_PAGE, filtered.length)}</span> dari{' '}
                  <span className="font-medium text-slate-700">{filtered.length}</span> anggota
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="px-2.5 py-1 text-xs border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Sebelumnya
                  </button>
                  {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                        p === safePage
                          ? 'bg-burgundy text-white'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
                    disabled={safePage >= totalPage}
                    className="px-2.5 py-1 text-xs border border-slate-200 rounded-md text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-slate-900">
                {modal.mode === 'edit' ? 'Edit Anggota' : 'Tambah Anggota'}
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
                <label className="block text-xs font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="nama"
                  value={form.nama}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${
                    formErrors.nama ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.nama && <p className="text-[#FF6B6B] text-[11px] mt-1">{formErrors.nama}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">NIM</label>
                <input
                  type="text"
                  name="nim"
                  value={form.nim}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${
                    formErrors.nim ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.nim && <p className="text-[#FF6B6B] text-[11px] mt-1">{formErrors.nim}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Jabatan</label>
                <input
                  type="text"
                  name="jabatan"
                  value={form.jabatan}
                  onChange={handleFormChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${
                    formErrors.jabatan ? 'border-red-400' : 'border-slate-200'
                  }`}
                />
                {formErrors.jabatan && <p className="text-[#FF6B6B] text-[11px] mt-1">{formErrors.jabatan}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Angkatan</label>
                <input
                  type="text"
                  name="angkatan"
                  value={form.angkatan}
                  onChange={handleFormChange}
                  placeholder="Contoh: 2024"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
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
                    'Tambah Anggota'
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
