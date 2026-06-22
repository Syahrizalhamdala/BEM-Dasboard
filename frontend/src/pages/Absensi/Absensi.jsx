import { useState, useEffect } from 'react';
import { HiCamera, HiCheckCircle, HiClock, HiLocationMarker, HiRefresh, HiCalendar } from 'react-icons/hi';
import { Card, Badge, Skeleton } from '../../components/ui';
import AttendanceScanner from '../../components/attendance/AttendanceScanner';
import { getMyAttendance, getAttendanceStats } from '../../api/attendanceApi';

function formatDate(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function Absensi() {
  const [view, setView] = useState('table');
  const [stats, setStats] = useState(null);
  const [myAttendance, setMyAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, myData] = await Promise.all([
        getAttendanceStats(),
        getMyAttendance(),
      ]);
      setStats(statsData);
      setMyAttendance(myData);
    } catch {
      setStats(null);
      setMyAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleScanSuccess = () => {
    setView('table');
    fetchData();
  };

  return (
    <div className="space-y-[14px] animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[15px] font-medium text-slate-900">Absensi</h1>
          <p className="text-xs text-slate-500 mt-0.5">QR Code + GPS Validation</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView(view === 'scan' ? 'table' : 'scan')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy text-white rounded-lg text-xs font-medium hover:bg-burgundy-dark transition-colors"
          >
            {view === 'scan' ? (
              <>Lihat Riwayat</>
            ) : (
              <><HiCamera className="w-3.5 h-3.5" /> Scan QR</>
            )}
          </button>
          <button
            onClick={fetchData}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <HiRefresh className="w-4 h-4" />
          </button>
        </div>
      </div>

      {view === 'scan' ? (
        <Card>
          <AttendanceScanner onSuccess={handleScanSuccess} />
        </Card>
      ) : (
        <>
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatTile icon={HiCheckCircle} label="Hadir Hari Ini" value={stats.statCards?.[0]?.value ?? 0} color="emerald" />
              <StatTile icon={HiCalendar} label="Hadir Bulan Ini" value={stats.statCards?.[1]?.value ?? 0} color="blue" />
              <StatTile icon={HiClock} label="Total Hadir" value={stats.statCards?.[2]?.value ?? 0} color="violet" />
              <StatTile icon={HiLocationMarker} label="Kehadiran" value={`${stats.persentaseKehadiran ?? 0}%`} color="amber" />
            </div>
          )}

          {stats?.todayCheckIns?.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-slate-900">Absensi Hari Ini</h3>
                <span className="text-xs text-slate-400">{stats.todayCheckIns.length} orang</span>
              </div>
              <div className="overflow-x-auto -mx-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left py-2.5 px-4 text-[11px] font-medium text-slate-500">Nama</th>
                      <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Waktu</th>
                      <th className="text-left py-2.5 px-3 text-[11px] font-medium text-slate-500">Metode</th>
                      <th className="text-right py-2.5 px-4 text-[11px] font-medium text-slate-500">Jarak</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.todayCheckIns.map((item) => (
                      <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="py-2.5 px-4">
                          <span className="text-sm text-slate-900">{item.nama}</span>
                        </td>
                        <td className="py-2.5 px-3 text-sm text-slate-600">{item.waktu}</td>
                        <td className="py-2.5 px-3">
                          <Badge variant={item.metode === 'qr_gps' ? 'success' : 'info'}>
                            {item.metode === 'qr_gps' ? 'QR+GPS' : item.metode === 'qr_code' ? 'QR' : 'GPS'}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-4 text-right text-sm text-slate-600">
                          {item.distance ? `${parseFloat(item.distance).toFixed(1)}m` : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-900">Riwayat Absensi Saya</h3>
              <span className="text-xs text-slate-400">{myAttendance.length} absensi</span>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-2.5 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : myAttendance.length === 0 ? (
              <div className="text-center py-8">
                <HiCamera className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500">Belum ada riwayat absensi</p>
                <button
                  onClick={() => setView('scan')}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy/10 text-burgundy rounded-lg text-xs font-medium hover:bg-burgundy/20 transition-colors"
                >
                  <HiCamera className="w-3.5 h-3.5" />
                  Absen Sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {myAttendance.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50/80 hover:bg-slate-100/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-burgundy/10 flex items-center justify-center shrink-0">
                      <HiCalendar className="w-5 h-5 text-burgundy/80" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{item.agenda?.agenda || 'Agenda'}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">
                          {item.check_in_time ? formatDate(item.check_in_time) : '-'}
                        </span>
                        <Badge variant={item.verification_method === 'qr_gps' ? 'success' : 'info'}>
                          {item.verification_method === 'qr_gps' ? 'QR+GPS' : item.verification_method}
                        </Badge>
                      </div>
                      {item.distance && (
                        <p className="text-[10px] text-slate-400 mt-1">Jarak: {parseFloat(item.distance).toFixed(1)}m dari kampus</p>
                      )}
                    </div>
                    <Badge variant="success" dot>Hadir</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function StatTile({ icon: Icon, label, value, color }) {
  const colors = {
    emerald: 'bg-emerald-50 text-emerald-600',
    blue: 'bg-burgundy/10 text-burgundy',
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/70 p-4">
      <div className={`w-8 h-8 rounded-lg ${colors[color] || colors.blue} flex items-center justify-center mb-2`}>
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-lg font-semibold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500 mt-px">{label}</p>
    </div>
  );
}
