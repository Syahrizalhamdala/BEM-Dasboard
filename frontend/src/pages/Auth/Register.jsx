import { useState } from 'react';
import { Link } from 'react-router-dom';

import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [form, setForm] = useState({
    nama: '',
    nim: '',
    email: '',
    divisi: '',
    jabatan: '',
    password: '',
    password_confirmation: '',
  });

  const divisiOptions = [
    'Sekretaris', 'Bendahara', 'PSDM', 'Kastrad',
    'Kominfo', 'Senbud', 'Danus', 'Lingkar'
  ];
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!form.nama.trim()) errors.nama = 'Nama harus diisi';
    if (!form.nim.trim()) errors.nim = 'NIM harus diisi';
    if (!form.email.trim()) errors.email = 'Email harus diisi';
    else if (!form.email.endsWith('@nusaputra.ac.id')) errors.email = 'Email harus menggunakan domain @nusaputra.ac.id';
    if (!form.divisi) errors.divisi = 'Divisi harus dipilih';
    if (!form.jabatan.trim()) errors.jabatan = 'Jabatan harus diisi';
    if (!form.password) errors.password = 'Password harus diisi';
    else if (form.password.length < 6) errors.password = 'Password minimal 6 karakter';
    if (!form.password_confirmation) errors.password_confirmation = 'Konfirmasi password harus diisi';
    else if (form.password !== form.password_confirmation)
      errors.password_confirmation = 'Password tidak cocok';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      await register(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registrasi gagal');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (name) =>
    `w-full h-[48px] px-4 bg-white border rounded-xl text-slate-900 text-[15px] outline-none transition-all duration-200 placeholder:text-slate-400 ${
      fieldErrors[name]
        ? 'border-red-500'
        : 'border-slate-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/15'
    }`;

  if (success) {
    return (
      <div className="min-h-screen relative bg-black overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/kabinet.JPG"
            alt=""
            className="w-full h-full object-cover pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />
        </div>
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex items-center justify-between px-5 md:px-12 pt-5 md:pt-8">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Kabinet Nawasena"
                className="w-8 h-8 md:w-10 md:h-10 object-contain"
              />
              <div className="hidden md:block">
                <p className="text-white font-semibold text-sm leading-tight">Kabinet Nawasena</p>
                <p className="text-white/45 text-[11px]">BEM Universitas Nusa Putra</p>
              </div>
            </div>
            <a
              href="/"
              className="text-white/60 hover:text-white text-xs md:text-sm transition-colors"
            >
              &larr; Kembali ke Website
            </a>
          </div>
          <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-5 md:px-12 py-6 md:py-0">
            <div className="hidden md:block max-w-lg">
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Selamat Datang<br />di Kabinet Nawasena
              </h1>
              <p className="mt-4 text-white/55 text-base leading-relaxed max-w-sm">
                Portal khusus anggota BEM Universitas Nusa Putra.
                Daftar untuk mengakses dashboard dan fitur kabinet.
              </p>
            </div>
            <div className="w-full md:w-[40%] max-w-xl md:ml-auto">
              <div className="bg-white rounded-2xl md:rounded-[24px] shadow-2xl p-6 md:p-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-full text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-2">Registrasi Berhasil!</h2>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    Akun kamu sedang menunggu persetujuan admin kabinet. Silakan tunggu konfirmasi dari admin.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center h-12 px-6 bg-burgundy hover:bg-burgundy-dark text-white rounded-xl text-sm font-medium transition-colors"
                  >
                    Kembali ke Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const field = (name, label, type = 'text', extra = {}) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        {type === 'select' ? (
          <>
            <select
              id={name} name={name} value={form[name]}
              onChange={handleChange}
              className={`${inputCls(name)} appearance-none pr-8 ${!form[name] ? 'text-slate-400' : 'text-slate-900'}`}
            >
              <option value="" disabled />
              {extra.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        ) : type === 'password' ? (
          <>
            <input
              type={extra.show ? 'text' : 'password'}
              id={name} name={name} value={form[name]}
              onChange={handleChange}
              placeholder={extra.placeholder || `Masukkan ${label.toLowerCase()}`}
              required autoComplete={extra.autoComplete}
              minLength={extra.minLength}
              className={`${inputCls(name)} pr-11`}
            />
            <button
              type="button"
              onClick={extra.onToggle}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              tabIndex={-1}
            >
              {extra.show ? <HiEyeOff className="text-lg" /> : <HiEye className="text-lg" />}
            </button>
          </>
        ) : (
          <input
            type={type}
            id={name} name={name} value={form[name]}
            onChange={handleChange}
            placeholder={`Masukkan ${label.toLowerCase()}`}
            required autoComplete={extra.autoComplete}
            className={inputCls(name)}
          />
        )}
      </div>
      {fieldErrors[name] && <p className="text-red-600 text-[12px] mt-1">{fieldErrors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen relative bg-black overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/kabinet.JPG"
          alt=""
          className="w-full h-full object-cover pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between px-5 md:px-12 pt-5 md:pt-8">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Kabinet Nawasena"
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
            <div className="hidden md:block">
              <p className="text-white font-semibold text-sm leading-tight">Kabinet Nawasena</p>
              <p className="text-white/45 text-[11px]">BEM Universitas Nusa Putra</p>
            </div>
          </div>
          <a
            href="/"
            className="text-white/60 hover:text-white text-xs md:text-sm transition-colors"
          >
            &larr; Kembali ke Website
          </a>
        </div>
        <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-5 md:px-12 py-6 md:py-0">
          <div className="hidden md:block max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Selamat Datang<br />di Kabinet Nawasena
            </h1>
            <p className="mt-4 text-white/55 text-base leading-relaxed max-w-sm">
              Portal khusus anggota BEM Universitas Nusa Putra.
              Daftar untuk mengakses dashboard dan fitur kabinet.
            </p>
          </div>
          <div className="w-full md:w-[40%] max-w-xl md:ml-auto">
            <div
              className="bg-white rounded-2xl md:rounded-[24px] shadow-2xl p-6 md:p-10 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Daftar</h2>
              <p className="text-sm text-slate-500 mt-1 mb-6 md:mb-8">
                Daftarkan akun Kabinet Anda
              </p>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs animate-fade-in">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {field('nama', 'Nama Lengkap', 'text', { autoComplete: 'name' })}
                {field('nim', 'NIM')}
                {field('email', 'Email', 'email', { autoComplete: 'email' })}
                {field('divisi', 'Pilih Divisi', 'select', { options: divisiOptions })}
                {field('jabatan', 'Jabatan')}
                {field('password', 'Password', 'password', {
                  show: showPassword,
                  onToggle: () => setShowPassword(!showPassword),
                  minLength: 6,
                  autoComplete: 'new-password',
                })}
                {field('password_confirmation', 'Konfirmasi Password', 'password', {
                  show: showKonfirmasi,
                  onToggle: () => setShowKonfirmasi(!showKonfirmasi),
                  autoComplete: 'new-password',
                })}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-burgundy hover:bg-burgundy-dark rounded-xl text-white text-[15px] font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                      Mendaftarkan...
                    </>
                  ) : 'Daftar Sekarang'}
                </button>
              </form>
              <p className="text-center text-sm text-slate-500 mt-6">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-burgundy hover:text-burgundy-dark font-semibold transition-colors">
                  Masuk
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
