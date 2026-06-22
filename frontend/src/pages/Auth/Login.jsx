import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });

  const validateForm = () => {
    const errors = { email: '', password: '' };
    if (!email.trim()) errors.email = 'Email harus diisi';
    else if (!email.endsWith('@nusaputra.ac.id')) errors.email = 'Email harus menggunakan domain @nusaputra.ac.id';
    if (!password.trim()) errors.password = 'Password harus diisi';
    setFieldErrors(errors);
    return !errors.email && !errors.password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen relative bg-black overflow-hidden">

      {/* Background image full-bleed */}
      <div className="absolute inset-0">
        <img
          src="/kabinet.JPG"
          alt=""
          className="w-full h-full object-cover pointer-events-none select-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">

        {/* Top bar */}
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

        {/* Main area */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-between px-5 md:px-12 py-6 md:py-0">

          {/* Left: headline (desktop only) */}
          <div className="hidden md:block max-w-lg">
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
              Selamat Datang<br />di Kabinet Nawasena
            </h1>
            <p className="mt-4 text-white/55 text-base leading-relaxed max-w-sm">
              Portal khusus anggota BEM Universitas Nusa Putra.
              Masuk untuk mengakses dashboard dan fitur kabinet.
            </p>
          </div>

          {/* Right: floating card form */}
          <div className="w-full md:w-[40%] max-w-xl md:ml-auto">
            <div
              className="bg-white rounded-2xl md:rounded-[24px] shadow-2xl p-6 md:p-10 animate-fade-in"
              style={{ animationDelay: '0.1s' }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Selamat Datang Kembali</h2>
              <p className="text-sm text-slate-500 mt-1 mb-6 md:mb-8">
                Silakan masuk ke akun Kabinet Anda
              </p>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs animate-fade-in">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="Masukkan email Anda"
                    required
                    autoComplete="email"
                    className={`w-full h-[48px] px-4 bg-white border rounded-xl text-slate-900 text-[15px] outline-none transition-all duration-200 placeholder:text-slate-400 ${
                      fieldErrors.email
                        ? 'border-red-500'
                        : 'border-slate-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/15'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-600 text-[12px] mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => handleFieldChange('password', e.target.value)}
                      placeholder="Masukkan password Anda"
                      required
                      autoComplete="current-password"
                      className={`w-full h-[48px] px-4 pr-11 bg-white border rounded-xl text-slate-900 text-[15px] outline-none transition-all duration-200 placeholder:text-slate-400 ${
                        fieldErrors.password
                          ? 'border-red-500'
                          : 'border-slate-200 focus:border-burgundy focus:ring-2 focus:ring-burgundy/15'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <HiEyeOff className="text-lg" />
                      ) : (
                        <HiEye className="text-lg" />
                      )}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-red-600 text-[12px] mt-1">{fieldErrors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-burgundy focus:ring-burgundy/30 accent-burgundy"
                    />
                    Ingat saya
                  </label>
                  <button
                    type="button"
                    className="text-burgundy hover:text-burgundy-dark font-medium transition-colors"
                  >
                    Lupa password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-burgundy hover:bg-burgundy-dark rounded-xl text-white text-[15px] font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Masuk'
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 mt-6">
                Belum punya akun?{' '}
                <Link to="/register" className="text-burgundy hover:text-burgundy-dark font-semibold transition-colors">
                  Daftar
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
