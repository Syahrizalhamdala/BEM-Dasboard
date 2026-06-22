import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { HiUser, HiCog, HiLogout, HiChevronDown } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const today = new Date();
  const dateStr = today.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    if (window.confirm('Yakin ingin keluar?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <header className="bg-white border-b border-slate-200/70">
      <div className="flex items-center justify-between px-5 lg:px-6 py-3">
        <div className="lg:ml-0 ml-10">
          <h1 className="text-[15px] font-medium text-slate-900">{title || 'Dashboard'}</h1>
          <p className="text-[11px] text-slate-400 mt-px">{dateStr}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-slate-100 rounded-[7px] px-[10px] py-[5px] text-slate-400">
            <Search size={13} />
            <input
              type="text"
              placeholder="Cari..."
              className="bg-transparent border-none outline-none text-[11px] text-slate-600 w-[120px] placeholder:text-slate-400"
            />
          </div>

          <button className="relative flex items-center justify-center bg-slate-100 text-slate-500" style={{ width: 30, height: 30, borderRadius: 7 }}>
            <Bell size={14} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#7A1F2B' }} />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 border border-slate-200 rounded-[7px] px-[8px] py-[4px] hover:bg-slate-50 transition-colors duration-150"
            >
              <div
                className="flex items-center justify-center shrink-0 text-white text-[10px] font-medium"
                style={{ width: 24, height: 24, borderRadius: 5, backgroundColor: '#7A1F2B' }}
              >
                {getInitials(user?.name)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-[11px] font-medium text-slate-900 leading-tight">{user?.name || 'Pengurus'}</p>
                <p className="text-[10px] text-slate-400 leading-tight capitalize">{user?.role || 'anggota'}</p>
              </div>
              <HiChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-150 shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-10 w-52 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50 animate-scale-in">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                  <p className="text-xs text-slate-500 truncate mt-px">{user?.email}</p>
                  <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 capitalize mt-1.5">{user?.role}</span>
                </div>
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/pengaturan'); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <HiUser className="w-4 h-4 text-slate-400" />
                  Profil Saya
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/pengaturan'); }}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <HiCog className="w-4 h-4 text-slate-400" />
                  Pengaturan
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <HiLogout className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
