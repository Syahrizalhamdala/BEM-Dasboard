import { useState, useEffect, useCallback } from 'react';
import { HiBell, HiShieldCheck, HiUser, HiKey, HiSave, HiX, HiEye, HiEyeOff } from 'react-icons/hi';
import { Card } from '../../components/ui';
import apiClient from '../../api/apiClient';

const NOTIF_KEY = 'bem-notifikasi';

function loadNotifikasi() {
  try {
    const saved = localStorage.getItem(NOTIF_KEY);
    return saved ? JSON.parse(saved) : { agenda: true, absensi: true, laporan: true };
  } catch {
    return { agenda: true, absensi: true, laporan: true };
  }
}

export default function Pengaturan() {
  const [notifikasi, setNotifikasi] = useState(loadNotifikasi);
  const [saved, setSaved] = useState(false);

  const [profilModal, setProfilModal] = useState({ open: false });
  const [passwordModal, setPasswordModal] = useState({ open: false });
  const [twoFaModal, setTwoFaModal] = useState({ open: false });

  const [profilForm, setProfilForm] = useState({ name: '', email: '', nim: '' });
  const [profilErrors, setProfilErrors] = useState({});
  const [profilSaving, setProfilSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwSaving, setPwSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    apiClient.get('/auth/me').then(({ data }) => {
      if (data.success) {
        const u = data.user;
        setProfilForm({ name: u.name || '', email: u.email || '', nim: u.nim || '' });
      }
    }).catch(() => {});
  }, []);

  const openProfileModal = () => {
    setProfilErrors({});
    setProfilModal({ open: true });
  };

  const closeProfileModal = () => {
    setProfilModal({ open: false });
    setProfilErrors({});
  };

  const handleProfilChange = (e) => {
    setProfilForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (profilErrors[e.target.name]) {
      setProfilErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handleProfilSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!profilForm.name.trim()) errors.name = 'Nama harus diisi';
    if (!profilForm.email.trim()) errors.email = 'Email harus diisi';
    if (Object.keys(errors).length > 0) { setProfilErrors(errors); return; }

    setProfilSaving(true);
    try {
      const { data } = await apiClient.put('/auth/profile', {
        name: profilForm.name.trim(),
        email: profilForm.email.trim(),
        nim: profilForm.nim.trim(),
      });
      if (data.success) {
        closeProfileModal();
      }
    } catch (err) {
      const msg = err.response?.data?.errors?.[Object.keys(err.response?.data?.errors || {})[0]]?.[0]
        || err.response?.data?.message
        || 'Gagal memperbarui profil';
      setProfilErrors((prev) => ({ ...prev, _general: msg }));
    } finally {
      setProfilSaving(false);
    }
  };

  const toggleNotif = useCallback((key) => {
    setNotifikasi((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(NOTIF_KEY, JSON.stringify(next));
      return next;
    });
    setSaved(false);
  }, []);

  const handleSavePengaturan = () => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(notifikasi));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const openPasswordModal = () => {
    setPwForm({ current_password: '', new_password: '', new_password_confirmation: '' });
    setPwErrors({});
    setShowPw(false);
    setPasswordModal({ open: true });
  };

  const closePasswordModal = () => {
    setPasswordModal({ open: false });
    setPwErrors({});
  };

  const handlePwChange = (e) => {
    setPwForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (pwErrors[e.target.name]) {
      setPwErrors((prev) => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const handlePwSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!pwForm.current_password) errors.current_password = 'Password saat ini harus diisi';
    if (!pwForm.new_password) errors.new_password = 'Password baru harus diisi';
    else if (pwForm.new_password.length < 6) errors.new_password = 'Minimal 6 karakter';
    if (pwForm.new_password !== pwForm.new_password_confirmation) errors.new_password_confirmation = 'Konfirmasi password tidak cocok';
    if (Object.keys(errors).length > 0) { setPwErrors(errors); return; }

    setPwSaving(true);
    try {
      const { data } = await apiClient.put('/auth/password', pwForm);
      if (data.success) {
        closePasswordModal();
      }
    } catch (err) {
      const msg = err.response?.data?.errors?.[Object.keys(err.response?.data?.errors || {})[0]]?.[0]
        || err.response?.data?.message
        || 'Gagal mengubah password';
      setPwErrors((prev) => ({ ...prev, _general: msg }));
    } finally {
      setPwSaving(false);
    }
  };

  const notifConfig = [
    { key: 'agenda', icon: HiBell, label: 'Notifikasi Agenda', desc: 'Pengingat agenda mendatang' },
    { key: 'absensi', icon: HiBell, label: 'Notifikasi Absensi', desc: 'Info pembukaan dan penutupan absensi' },
    { key: 'laporan', icon: HiBell, label: 'Notifikasi Laporan', desc: 'Pemberitahuan laporan baru dan revisi' },
  ];

  return (
    <div className="space-y-[14px] animate-fade-in">
      <div className="mb-6">
        <h1 className="text-[15px] font-medium text-slate-900">Pengaturan</h1>
        <p className="text-xs text-slate-600 mt-0.5">Atur preferensi aplikasi</p>
      </div>

      <div className="max-w-2xl space-y-5">
        <Card>
          <h3 className="text-sm font-medium text-slate-900 mb-4">Notifikasi</h3>
          <div className="space-y-1">
            {notifConfig.map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 bg-burgundy/10 rounded-xl flex items-center justify-center">
                    <item.icon className="text-burgundy text-lg" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleNotif(item.key)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${notifikasi[item.key] ? 'bg-burgundy' : 'bg-slate-200'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${notifikasi[item.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-slate-900 mb-4">Keamanan</h3>
          <div className="space-y-1">
            <div onClick={openProfileModal} className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-burgundy/10 rounded-xl flex items-center justify-center">
                  <HiUser className="text-burgundy text-lg" />
                </div>
                <div>
                  <p className="text-sm text-slate-900">Ubah Profil</p>
                  <p className="text-xs text-slate-500">Perbarui data profil Anda</p>
                </div>
              </div>
              <button className="px-4 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                Atur
              </button>
            </div>
            <div onClick={openPasswordModal} className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-burgundy/10 rounded-xl flex items-center justify-center">
                  <HiKey className="text-burgundy text-lg" />
                </div>
                <div>
                  <p className="text-sm text-slate-900">Ubah Password</p>
                  <p className="text-xs text-slate-500">Ganti kata sandi akun</p>
                </div>
              </div>
              <button className="px-4 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                Atur
              </button>
            </div>
            <div onClick={() => setTwoFaModal({ open: true })} className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50/50 rounded-lg px-2 -mx-2 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 bg-burgundy/10 rounded-xl flex items-center justify-center">
                  <HiShieldCheck className="text-burgundy text-lg" />
                </div>
                <div>
                  <p className="text-sm text-slate-900">Verifikasi Dua Langkah</p>
                  <p className="text-xs text-slate-500">Tingkatkan keamanan akun</p>
                </div>
              </div>
              <button className="px-4 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                Atur
              </button>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs text-emerald-600 font-medium">Pengaturan tersimpan</span>
          )}
          <button
            onClick={handleSavePengaturan}
            className="inline-flex items-center gap-2 px-5 py-2 bg-burgundy text-white rounded-lg hover:bg-burgundy-dark transition-all duration-200 text-sm"
          >
            <HiSave className="text-base" />
            Simpan Pengaturan
          </button>
        </div>
      </div>

      {profilModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeProfileModal} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-slate-900">Ubah Profil</h2>
              <button onClick={closeProfileModal} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <HiX className="w-4 h-4" />
              </button>
            </div>
            {profilErrors._general && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">{profilErrors._general}</div>
            )}
            <form onSubmit={handleProfilSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nama</label>
                <input type="text" name="name" value={profilForm.name} onChange={handleProfilChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${profilErrors.name ? 'border-red-400' : 'border-slate-200'}`} />
                {profilErrors.name && <p className="text-red-500 text-[11px] mt-1">{profilErrors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <input type="email" name="email" value={profilForm.email} onChange={handleProfilChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${profilErrors.email ? 'border-red-400' : 'border-slate-200'}`} />
                {profilErrors.email && <p className="text-red-500 text-[11px] mt-1">{profilErrors.email}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">NIM</label>
                <input type="text" name="nim" value={profilForm.nim} onChange={handleProfilChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${profilErrors.nim ? 'border-red-400' : 'border-slate-200'}`} />
                {profilErrors.nim && <p className="text-red-500 text-[11px] mt-1">{profilErrors.nim}</p>}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button type="button" onClick={closeProfileModal}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" disabled={profilSaving}
                  className="flex-1 px-3 py-2 bg-burgundy hover:bg-burgundy-dark text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {profilSaving ? <><div className="w-3.5 h-3.5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" /> Menyimpan...</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {passwordModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closePasswordModal} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-medium text-slate-900">Ubah Password</h2>
              <button onClick={closePasswordModal} className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
                <HiX className="w-4 h-4" />
              </button>
            </div>
            {pwErrors._general && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">{pwErrors._general}</div>
            )}
            <form onSubmit={handlePwSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password Saat Ini</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} name="current_password" value={pwForm.current_password} onChange={handlePwChange}
                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${pwErrors.current_password ? 'border-red-400' : 'border-slate-200'}`} />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <HiEyeOff className="w-4 h-4" /> : <HiEye className="w-4 h-4" />}
                  </button>
                </div>
                {pwErrors.current_password && <p className="text-red-500 text-[11px] mt-1">{pwErrors.current_password}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password Baru</label>
                <input type="password" name="new_password" value={pwForm.new_password} onChange={handlePwChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${pwErrors.new_password ? 'border-red-400' : 'border-slate-200'}`} />
                {pwErrors.new_password && <p className="text-red-500 text-[11px] mt-1">{pwErrors.new_password}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Konfirmasi Password Baru</label>
                <input type="password" name="new_password_confirmation" value={pwForm.new_password_confirmation} onChange={handlePwChange}
                  className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-900 outline-none transition-all focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy ${pwErrors.new_password_confirmation ? 'border-red-400' : 'border-slate-200'}`} />
                {pwErrors.new_password_confirmation && <p className="text-red-500 text-[11px] mt-1">{pwErrors.new_password_confirmation}</p>}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button type="button" onClick={closePasswordModal}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors">Batal</button>
                <button type="submit" disabled={pwSaving}
                  className="flex-1 px-3 py-2 bg-burgundy hover:bg-burgundy-dark text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {pwSaving ? <><div className="w-3.5 h-3.5 border-2 border-white/70 border-t-transparent rounded-full animate-spin" /> Menyimpan...</> : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {twoFaModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setTwoFaModal({ open: false })} />
          <div className="relative bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiShieldCheck className="text-amber-500 text-2xl" />
            </div>
            <h2 className="text-sm font-medium text-slate-900 mb-2">Verifikasi Dua Langkah</h2>
            <p className="text-xs text-slate-500 mb-5">Fitur ini belum tersedia. Nantikan pembaruan selanjutnya.</p>
            <button onClick={() => setTwoFaModal({ open: false })}
              className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium transition-colors">
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
