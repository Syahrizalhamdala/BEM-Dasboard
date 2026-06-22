import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../hooks/useSidebar';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, CalendarCheck, ClipboardCheck,
  FileSearch, FileCheck, PenLine, Bot, BarChart3,
  Database, Settings2, Menu, X, LogOut
} from 'lucide-react';
import { getAgenda } from '../../api/agendaApi';

const menuGroups = [
  {
    label: 'UTAMA',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/anggota', label: 'Anggota', icon: Users },
      { path: '/agenda', label: 'Agenda', icon: CalendarCheck, badge: true },
      { path: '/absensi', label: 'Absensi', icon: ClipboardCheck },
    ],
  },
  {
    label: 'PROPOSAL',
    items: [
      { path: '/proposal-check', label: 'Cek Proposal', icon: FileSearch },
      { path: '/review-proposal', label: 'Review Proposal', icon: FileCheck },
    ],
  },
  {
    label: 'TOOLS',
    items: [
      { path: '/approval', label: 'Tanda Tangan', icon: PenLine },
      { path: '/chatbot', label: 'Chatbot', icon: Bot },
      { path: '/laporan', label: 'Laporan', icon: BarChart3 },
      { path: '/import-data', label: 'Import Data', icon: Database },
      { path: '/pengaturan', label: 'Pengaturan', icon: Settings2 },
    ],
  },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { isMobileOpen, toggleMobile, closeMobile } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [agendaCount, setAgendaCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchCount = async () => {
      try {
        const data = await getAgenda();
        if (!mounted) return;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const active = data.filter((a) => {
          if (!a.tanggal) return false;
          return new Date(a.tanggal) >= now;
        });
        setAgendaCount(active.length);
      } catch {
        // silent
      }
    };
    fetchCount();
    return () => { mounted = false; };
  }, []);

  const handleLogout = async () => {
    if (window.confirm('Yakin ingin keluar?')) {
      await logout();
      navigate('/login');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white" style={{ width: 220, borderRight: '0.5px solid #e2e8f0' }}>
      {/* LOGO AREA */}
      <div style={{ borderBottom: '0.5px solid #e2e8f0' }} className="px-4 py-[14px]">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center shrink-0 overflow-hidden"
            style={{ width: 36, height: 36, backgroundColor: '#7A1F2B', borderRadius: 10 }}
          >
            <img src="/logo.png" alt="BEM" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: '#0f172a', lineHeight: 1.2, margin: 0 }}>Kabinet Nawasena</p>
            <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2, marginBottom: 0 }}>BEM Nusa Putra</p>
          </div>
        </div>
      </div>

      {/* NAV MENU */}
      <nav className="flex-1 overflow-y-auto py-2" style={{ scrollbarWidth: 'thin' }}>
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p
              className="px-4 pb-1"
              style={{
                fontSize: 10,
                fontWeight: 500,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                paddingTop: 14,
                margin: 0,
              }}
            >
              {group.label}
            </p>
            {group.items.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobile}
                  className="flex items-center no-underline"
                  style={{
                    padding: '9px 10px',
                    margin: '0 8px',
                    borderRadius: 9,
                    backgroundColor: isActive ? '#7A1F2B' : 'transparent',
                    gap: 10,
                    transition: 'background-color 0.15s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div
                    className="flex items-center justify-center shrink-0"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 8,
                      backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : '#f1f5f9',
                      color: isActive ? '#fff' : '#64748b',
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      color: isActive ? '#fff' : '#64748b',
                      fontWeight: isActive ? 500 : 400,
                      lineHeight: 1,
                    }}
                  >
                    {item.label}
                  </span>
                  {item.badge && agendaCount > 0 && (
                    <span
                      className="ml-auto"
                      style={{
                        fontSize: 10,
                        padding: '2px 7px',
                        borderRadius: 20,
                        backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(122,31,43,0.12)',
                        color: isActive ? '#fff' : '#7A1F2B',
                        fontWeight: 500,
                        lineHeight: '14px',
                      }}
                    >
                      {agendaCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* USER FOOTER */}
      <div style={{ borderTop: '0.5px solid #e2e8f0' }} className="px-3 py-3 mt-auto">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center shrink-0 text-white text-xs font-medium"
            style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#7A1F2B' }}
          >
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize: 12, fontWeight: 500, color: '#0f172a', margin: 0 }} className="truncate">
              {user?.name || 'Pengurus'}
            </p>
            <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }} className="truncate capitalize">
              {user?.role || 'anggota'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center shrink-0 text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              border: '0.5px solid #e2e8f0',
              backgroundColor: 'transparent',
              transition: 'all 0.15s',
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-3 left-3 z-50 flex items-center justify-center bg-white border border-slate-200 shadow-sm text-slate-600 cursor-pointer"
        style={{ width: 32, height: 32, borderRadius: 8 }}
      >
        <Menu size={16} />
      </button>

      {isMobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={closeMobile} />
      )}

      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen z-30">
        {navContent}
      </aside>

      <aside
        className={`lg:hidden fixed top-0 left-0 h-screen z-50 transition-transform duration-200 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={closeMobile}
            className="flex items-center justify-center bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            style={{ width: 28, height: 28, borderRadius: 6 }}
          >
            <X size={14} />
          </button>
        </div>
        {navContent}
      </aside>
    </>
  );
}
