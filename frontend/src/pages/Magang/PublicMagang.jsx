import { useState, useEffect, useCallback } from 'react';
import {
  HiOutlineBriefcase, HiOutlineLocationMarker, HiOutlineClock,
  HiOutlineCheckCircle, HiOutlineGift, HiOutlineMail, HiOutlineX,
  HiOutlineUser, HiOutlineAcademicCap, HiOutlineDocumentText,
  HiOutlinePhone,
} from 'react-icons/hi';
import { getPublicMagang, getPublicMagangById, applyMagang } from '../../api/magangApi';

export default function PublicMagang() {
  const [magangList, setMagangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMagang, setSelectedMagang] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showApply, setShowApply] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const [form, setForm] = useState({
    nama_lengkap: '', nim: '', email: '', no_hp: '',
    universitas: '', prodi: '', semester: '', motivasi: '',
    cv: null,
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchMagang = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicMagang();
      setMagangList(data);
    } catch {
      setError('Gagal memuat data magang. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMagang(); }, [fetchMagang]);

  const openDetail = async (magang) => {
    try {
      const detail = await getPublicMagangById(magang.id);
      setSelectedMagang(detail);
      setShowDetail(true);
    } catch {
      setSelectedMagang(magang);
      setShowDetail(true);
    }
  };

  const openApply = () => {
    setShowDetail(false);
    setShowApply(true);
    setForm({
      nama_lengkap: '', nim: '', email: '', no_hp: '',
      universitas: '', prodi: '', semester: '', motivasi: '', cv: null,
    });
    setFormErrors({});
    setSubmitResult(null);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv') {
      setForm((prev) => ({ ...prev, cv: files[0] || null }));
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
    if (!form.nama_lengkap.trim()) errors.nama_lengkap = 'Nama harus diisi';
    if (!form.email.trim()) errors.email = 'Email harus diisi';
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Email tidak valid';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSubmitting(true);
    setFormErrors({});
    try {
      const fd = new FormData();
      fd.append('nama_lengkap', form.nama_lengkap);
      fd.append('email', form.email);
      if (form.nim) fd.append('nim', form.nim);
      if (form.no_hp) fd.append('no_hp', form.no_hp);
      if (form.universitas) fd.append('universitas', form.universitas);
      if (form.prodi) fd.append('prodi', form.prodi);
      if (form.semester) fd.append('semester', form.semester);
      if (form.motivasi) fd.append('motivasi', form.motivasi);
      if (form.cv) fd.append('cv', form.cv);

      const result = await applyMagang(selectedMagang.id, fd);
      setSubmitResult(result);
    } catch (err) {
      const msg = err.message || 'Gagal mengirim pendaftaran';
      if (msg.includes('errors')) {
        try {
          const parsed = JSON.parse(msg);
          setFormErrors(parsed.errors || {});
        } catch {
          setFormErrors({ _general: msg });
        }
      } else {
        setFormErrors({ _general: msg });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  };

  const getRemainingDays = (deadline) => {
    if (!deadline) return null;
    const diff = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Telah berakhir';
    if (diff === 0) return 'Hari ini';
    return `${diff} hari lagi`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-burgundy/5">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-burgundy rounded-lg flex items-center justify-center">
              <HiOutlineBriefcase className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">Program Magang BEM</h1>
              <p className="text-[11px] text-slate-500">Badan Eksekutif Mahasiswa</p>
            </div>
          </div>
          <nav className="flex items-center gap-1.5">
            <a
              href="/"
              className="text-xs font-medium text-slate-600 hover:text-burgundy transition-colors px-3 py-1.5 rounded-lg hover:bg-burgundy/5"
            >
              Beranda
            </a>
            <a
              href="/login"
              className="text-xs font-medium text-white bg-burgundy hover:bg-burgundy-dark transition-colors px-3 py-1.5 rounded-lg"
            >
              Masuk Admin
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-burgundy/10 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-burgundy rounded-full animate-pulse" />
            <span className="text-[11px] font-medium text-burgundy">Sedang Dibuka</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Program Magang</h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Bergabunglah bersama kami dan dapatkan pengalaman berharga dalam kegiatan kepengurusan BEM.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-burgundy border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-sm text-red-500">{error}</p>
            <button onClick={fetchMagang} className="mt-3 text-xs text-burgundy hover:underline">
              Coba lagi
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && magangList.length === 0 && (
          <div className="text-center py-20">
            <HiOutlineBriefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Belum ada program magang yang dibuka saat ini.</p>
            <p className="text-xs text-slate-400 mt-1">Silakan cek kembali nanti.</p>
          </div>
        )}

        {/* Magang Cards */}
        {!loading && !error && magangList.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {magangList.map((magang) => (
              <div
                key={magang.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-burgundy/20 transition-all cursor-pointer group"
                onClick={() => openDetail(magang)}
              >
                {magang.gambar && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${magang.gambar}`}
                      alt={magang.judul_magang}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-burgundy transition-colors">
                      {magang.judul_magang}
                    </h3>
                    {magang.status === 'dibuka' && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-medium">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                        Dibuka
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                    {magang.deskripsi}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {magang.durasi && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                        <HiOutlineClock className="w-3 h-3" />
                        {magang.durasi}
                      </span>
                    )}
                    {magang.lokasi && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                        <HiOutlineLocationMarker className="w-3 h-3" />
                        {magang.lokasi}
                      </span>
                    )}
                  </div>

                  {magang.deadline && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        Deadline: {formatDate(magang.deadline)}
                      </span>
                      <span className={`text-[11px] font-medium ${
                        getRemainingDays(magang.deadline) === 'Telah berakhir'
                          ? 'text-red-500'
                          : 'text-burgundy'
                      }`}>
                        {getRemainingDays(magang.deadline)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {showDetail && selectedMagang && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowDetail(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {selectedMagang.gambar && (
              <div className="h-48 overflow-hidden rounded-t-2xl">
                <img
                  src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/storage/${selectedMagang.gambar}`}
                  alt={selectedMagang.judul_magang}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">{selectedMagang.judul_magang}</h2>
                  {selectedMagang.deadline && (
                    <p className="text-xs text-slate-400 mt-1">
                      Deadline: {formatDate(selectedMagang.deadline)}
                      {getRemainingDays(selectedMagang.deadline) && (
                        <span className={`ml-2 font-medium ${
                          getRemainingDays(selectedMagang.deadline) === 'Telah berakhir'
                            ? 'text-red-500' : 'text-burgundy'
                        }`}>
                          ({getRemainingDays(selectedMagang.deadline)})
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setShowDetail(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-5">
                {/* Deskripsi */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                    <HiOutlineDocumentText className="w-3.5 h-3.5 text-burgundy" />
                    Deskripsi
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {selectedMagang.deskripsi}
                  </p>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-4">
                  {selectedMagang.durasi && (
                    <div className="flex items-center gap-2">
                      <HiOutlineClock className="w-4 h-4 text-burgundy" />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Durasi</p>
                        <p className="text-xs font-medium text-slate-700">{selectedMagang.durasi}</p>
                      </div>
                    </div>
                  )}
                  {selectedMagang.lokasi && (
                    <div className="flex items-center gap-2">
                      <HiOutlineLocationMarker className="w-4 h-4 text-burgundy" />
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wide">Lokasi</p>
                        <p className="text-xs font-medium text-slate-700">{selectedMagang.lokasi}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Persyaratan */}
                {selectedMagang.persyaratan && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                      <HiOutlineCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                      Persyaratan
                    </h3>
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {selectedMagang.persyaratan}
                    </div>
                  </div>
                )}

                {/* Benefit */}
                {selectedMagang.benefit && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-900 mb-2 flex items-center gap-1.5">
                      <HiOutlineGift className="w-3.5 h-3.5 text-amber-500" />
                      Benefit
                    </h3>
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {selectedMagang.benefit}
                    </div>
                  </div>
                )}

                {/* Kontak */}
                {selectedMagang.kontak && (
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                    <HiOutlineMail className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">Kontak</p>
                      <p className="text-xs font-medium text-slate-700">{selectedMagang.kontak}</p>
                    </div>
                  </div>
                )}

                {/* CTA */}
                {selectedMagang.status === 'dibuka' && (
                  <div className="pt-2">
                    <button
                      onClick={openApply}
                      className="w-full py-3 bg-burgundy hover:bg-burgundy-dark text-white rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-burgundy/20"
                    >
                      Daftar Sekarang
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApply && selectedMagang && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !submitting && setShowApply(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Formulir Pendaftaran</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">{selectedMagang.judul_magang}</p>
              </div>
              <button
                onClick={() => !submitting && setShowApply(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                disabled={submitting}
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Success */}
              {submitResult && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <HiOutlineCheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-2">Pendaftaran Berhasil!</h3>
                  <p className="text-sm text-slate-500 mb-6">
                    {submitResult.message || 'Kami akan menghubungi Anda segera. Terima kasih telah mendaftar.'}
                  </p>
                  <button
                    onClick={() => { setShowApply(false); setSubmitResult(null); }}
                    className="px-6 py-2 bg-burgundy text-white rounded-lg text-sm font-medium hover:bg-burgundy-dark transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              )}

              {/* Form */}
              {!submitResult && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {formErrors._general && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                      {formErrors._general}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nama Lengkap <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        name="nama_lengkap"
                        value={form.nama_lengkap}
                        onChange={handleFormChange}
                        placeholder="Masukkan nama lengkap"
                        className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${
                          formErrors.nama_lengkap ? 'border-red-400' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {formErrors.nama_lengkap && <p className="text-red-500 text-[11px] mt-1">{formErrors.nama_lengkap}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">NIM</label>
                      <input
                        type="text"
                        name="nim"
                        value={form.nim}
                        onChange={handleFormChange}
                        placeholder="NIM (opsional)"
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleFormChange}
                          placeholder="email@domain.com"
                          className={`w-full pl-9 pr-3 py-2.5 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${
                            formErrors.email ? 'border-red-400' : 'border-slate-200'
                          }`}
                        />
                      </div>
                      {formErrors.email && <p className="text-red-500 text-[11px] mt-1">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">No. HP</label>
                      <div className="relative">
                        <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="no_hp"
                          value={form.no_hp}
                          onChange={handleFormChange}
                          placeholder="08xxxxxxxxxx"
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Semester</label>
                      <select
                        name="semester"
                        value={form.semester}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                      >
                        <option value="">Pilih</option>
                        {[1,2,3,4,5,6,7,8].map(s => (
                          <option key={s} value={String(s)}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Universitas</label>
                      <div className="relative">
                        <HiOutlineAcademicCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="universitas"
                          value={form.universitas}
                          onChange={handleFormChange}
                          placeholder="Nama universitas"
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Program Studi</label>
                      <input
                        type="text"
                        name="prodi"
                        value={form.prodi}
                        onChange={handleFormChange}
                        placeholder="Prodi"
                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Upload CV</label>
                    <input
                      type="file"
                      name="cv"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFormChange}
                      className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-burgundy/10 file:text-burgundy hover:file:bg-burgundy/20 file:cursor-pointer"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">Format: PDF, DOC, DOCX (maks 5MB)</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Motivasi</label>
                    <textarea
                      name="motivasi"
                      rows={3}
                      value={form.motivasi}
                      onChange={handleFormChange}
                      placeholder="Ceritakan motivasi kamu mengikuti program magang ini..."
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowApply(false)}
                      disabled={submitting}
                      className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-3 py-2.5 bg-burgundy hover:bg-burgundy-dark text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        'Kirim Pendaftaran'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
