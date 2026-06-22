import { useState, useEffect, useRef } from 'react';
import { HiCamera, HiLocationMarker, HiCheckCircle, HiXCircle, HiRefresh } from 'react-icons/hi';
import { scanAttendance, getCampusLocation } from '../../api/attendanceApi';

export default function AttendanceScanner({ onSuccess }) {
  const [step, setStep] = useState('idle');
  const [scannedToken, setScannedToken] = useState(null);
  const [gpsStatus, setGpsStatus] = useState(null);
  const [error, setError] = useState(null);
  const [campusLocation, setCampusLocation] = useState(null);
  const [scannerReady, setScannerReady] = useState(false);

  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    getCampusLocation()
      .then(setCampusLocation)
      .catch(() => {});
  }, []);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        try { html5QrCodeRef.current.stop(); } catch {}
      }
    };
  }, []);

  const startScanner = async () => {
    setError(null);
    setStep('scanning');
    setScannerReady(false);

    try {
      const Html5Qrcode = (await import('html5-qrcode')).Html5Qrcode;
      const scannerId = 'qr-scanner-element';
      const html5QrCode = new Html5Qrcode(scannerId);
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          html5QrCode.stop().catch(() => {});
          setScannedToken(decodedText);
          setStep('gps');
        },
        () => {}
      );
      setScannerReady(true);
    } catch (err) {
      setError(err.toString().includes('NotAllowedError')
        ? 'Izin kamera ditolak. Masukkan kode manual di bawah.'
        : err.toString().includes('NotFoundError')
          ? 'Kamera tidak ditemukan. Masukkan kode manual di bawah.'
          : 'Gagal mengakses kamera. Pastikan izin kamera diberikan.');
      setStep('idle');
    }
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      try { html5QrCodeRef.current.stop(); } catch {}
    }
    setStep('idle');
    setScannedToken(null);
    setScannerReady(false);
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung browser ini.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }),
        (err) => {
          if (err.code === 1) reject(new Error('Izin lokasi ditolak.'));
          else if (err.code === 2) reject(new Error('Posisi tidak tersedia.'));
          else if (err.code === 3) reject(new Error('Waktu permintaan lokasi habis.'));
          else reject(new Error('Gagal mendapatkan lokasi.'));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const submitAttendance = async () => {
    setStep('submitting');
    setError(null);

    try {
      let latitude = null;
      let longitude = null;

      try {
        const pos = await getCurrentPosition();
        latitude = pos.latitude;
        longitude = pos.longitude;
        setGpsStatus('success');
      } catch (gpsErr) {
        setGpsStatus('warning');
      }

      const result = await scanAttendance({
        qr_token: scannedToken,
        latitude,
        longitude,
      });

      setStep('success');
      if (onSuccess) onSuccess(result.data);

      setTimeout(() => {
        setStep('idle');
        setScannedToken(null);
        setGpsStatus(null);
      }, 3000);

    } catch (err) {
      setError(err.message || 'Gagal melakukan absensi.');
      setStep('idle');
    }
  };

  const submitManual = async (manualToken) => {
    if (!manualToken.trim()) {
      setError('Masukkan kode QR');
      return;
    }
    setScannedToken(manualToken.trim());
    setStep('gps');
    setError(null);
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
          <HiCheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-sm font-medium text-slate-900">Absensi Berhasil!</h3>
        <p className="text-xs text-slate-500 mt-1">Data kehadiran Anda telah dicatat.</p>
        {scannedToken && (
          <p className="text-[10px] text-slate-400 mt-2 font-mono truncate max-w-[200px]">{scannedToken}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {step === 'idle' && (
        <div className="flex flex-col items-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
            <HiCamera className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-sm font-medium text-slate-900 mb-1">Scan QR Code</h3>
          <p className="text-xs text-slate-500 text-center mb-5 max-w-xs">
            Arahkan kamera ke QR Code agenda untuk melakukan absensi
          </p>
          <button
            onClick={startScanner}
            className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy text-white rounded-lg text-xs font-medium hover:bg-burgundy-dark transition-colors"
          >
            <HiCamera className="w-4 h-4" />
            Buka Kamera
          </button>

          <div className="w-full mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 text-center mb-3">Atau masukkan kode QR manual</p>
            <ManualInput onSubmit={submitManual} />
          </div>
        </div>
      )}

      {step === 'scanning' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-900">Arahkan ke QR Code</h3>
            <button
              onClick={stopScanner}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Batal
            </button>
          </div>
          <div className="relative bg-slate-900 rounded-xl overflow-hidden">
            <div id="qr-scanner-element" className="w-full" style={{ minHeight: 280 }} />
            {!scannerReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      )}

      {step === 'gps' && (
        <div className="py-8">
          <div className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${gpsStatus === 'success' ? 'bg-emerald-50' : 'bg-burgundy/10'}`}>
              <HiLocationMarker className={`w-7 h-7 ${gpsStatus === 'success' ? 'text-emerald-500' : 'text-burgundy/80'}`} />
            </div>
            <h3 className="text-sm font-medium text-slate-900 mb-1">Verifikasi GPS</h3>
            <p className="text-xs text-slate-500 mb-5 max-w-xs">
              {gpsStatus === 'success'
                ? 'Lokasi terdeteksi. Melanjutkan absensi...'
                : 'Mendapatkan lokasi Anda untuk validasi radius kampus...'}
            </p>
            <button
              onClick={submitAttendance}
              className="inline-flex items-center gap-2 px-5 py-2 bg-burgundy text-white rounded-lg text-xs font-medium hover:bg-burgundy-dark transition-colors"
              disabled={step === 'submitting'}
            >
              {step === 'submitting' ? (
                <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
              ) : (
                <HiCheckCircle className="w-4 h-4" />
              )}
              {step === 'submitting' ? 'Memproses...' : 'Konfirmasi Absensi'}
            </button>

            {gpsStatus === 'warning' && (
              <p className="text-[10px] text-amber-600 mt-3">
                Lokasi tidak dapat diverifikasi. Absensi tetap dicatat tanpa GPS.
              </p>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2">
          <HiXCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-red-700">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <HiXCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {campusLocation && (
        <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
          <p className="text-[10px] text-slate-500 text-center">
            Radius kampus: {campusLocation.radius}m dari kampus utama
          </p>
        </div>
      )}
    </div>
  );
}

function ManualInput({ onSubmit }) {
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Masukkan kode QR..."
        className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 outline-none focus:ring-1 focus:ring-burgundy/40 focus:border-burgundy"
      />
      <button
        type="submit"
        className="px-3 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
      >
        Absen
      </button>
    </form>
  );
}
