import { useState, useEffect, useRef } from 'react';
import { HiUpload, HiDocumentText, HiCheckCircle, HiXCircle, HiDatabase, HiLockClosed, HiDownload, HiRefresh } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../api/apiClient';

export default function ImportData() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const inputRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const { data } = await apiClient.get('/chatbot/status');
      setStatus(data.data);
    } catch {
      setStatus(null);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  const handleFile = (f) => {
    setError(null);
    setResult(null);
    if (!f) return;
    if (!f.name.match(/\.(xlsx|xls)$/i)) {
      setError('Format file harus .xlsx atau .xls');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB');
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await apiClient.post('/chatbot/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
      fetchStatus();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Import gagal');
    } finally {
      setImporting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <HiLockClosed className="w-12 h-12 mb-4" />
        <p className="text-sm font-medium text-slate-600">Akses Terbatas</p>
        <p className="text-xs mt-1">Halaman ini hanya untuk admin</p>
      </div>
    );
  }

  const colorMap = {
    amber: 'text-amber-500',
    blue: 'text-blue-500',
    emerald: 'text-emerald-500',
  };

  const StatusCard = ({ label, count, color }) => (
    <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
      <HiDatabase className={`w-6 h-6 ${colorMap[color] || 'text-slate-500'} mx-auto mb-2`} />
      <p className="text-2xl font-bold text-slate-900">{count}</p>
      <p className="text-xs text-slate-500 mt-1">{label}</p>
    </div>
  );

  return (
    <div className="space-y-[14px] animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[15px] font-medium text-slate-900">Import Data BEM</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload file Excel untuk mengisi database kabinet, program kerja, dan jadwal rapat
          </p>
        </div>
        <button
          onClick={fetchStatus}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <HiRefresh className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {!loadingStatus && status && (
        <div className="grid grid-cols-3 gap-3">
          <StatusCard label="Kabinet" count={status.kabinet} color="amber" />
          <StatusCard label="Program Kerja" count={status.program_kerja} color="blue" />
          <StatusCard label="Jadwal Rapat" count={status.jadwal_rapat} color="emerald" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200/70 p-4">
        <h3 className="text-sm font-medium text-slate-900 mb-2">Format Excel</h3>
        <p className="text-xs text-slate-500 mb-3">
          File harus memiliki 3 sheet dengan header berikut:
        </p>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
            <div>
              <span className="font-medium text-slate-700">Sheet 1 — Kabinet:</span>
              <span className="text-slate-500 ml-1">jabatan, nama, angkatan</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-burgundy mt-1 shrink-0" />
            <div>
              <span className="font-medium text-slate-700">Sheet 2 — Program Kerja:</span>
              <span className="text-slate-500 ml-1">kementerian, program_kerja, bidang, bulan, tanggal, lokasi, deskripsi, status</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
            <div>
              <span className="font-medium text-slate-700">Sheet 3 — Jadwal Rapat:</span>
              <span className="text-slate-500 ml-1">agenda, lingkup, waktu_mulai, waktu_selesai, tempat, pemimpin, deskripsi</span>
            </div>
          </div>
        </div>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
          dragging
            ? 'border-blue-400 bg-blue-50/50'
            : file
              ? 'border-emerald-300 bg-emerald-50/30'
              : 'border-slate-200 bg-white hover:border-slate-300'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <HiDocumentText className="w-10 h-10 text-emerald-500" />
            <p className="text-sm font-medium text-slate-700">{file.name}</p>
            <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
              className="text-xs text-red-500 hover:text-red-600 mt-1"
            >
              Hapus file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <HiUpload className="w-10 h-10 text-slate-300" />
            <p className="text-sm text-slate-600">
              Tarik file ke sini atau <span className="text-burgundy font-medium">klik untuk upload</span>
            </p>
            <p className="text-xs text-slate-400">Format .xlsx / .xls maks 10MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
          <HiXCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {file && !importing && !result && (
        <button
          onClick={handleImport}
          className="w-full py-2.5 bg-burgundy hover:bg-burgundy-dark text-white rounded-lg text-sm font-medium transition-colors"
        >
          Import Data BEM
        </button>
      )}

      {importing && (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-5 h-5 border-2 border-burgundy border-t-transparent rounded-full animate-spin" />
          <div className="w-full max-w-xs h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-burgundy/50 animate-pulse" />
          </div>
          <span className="text-sm text-slate-500">Mengimport data...</span>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {result.success ? (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <HiCheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-emerald-700">Import berhasil!</p>
                <p className="text-xs text-emerald-600 mt-0.5">Data berhasil diimport ke database</p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
              <HiXCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600">{result.message}</p>
            </div>
          )}

          {result.success && (
            <button
              onClick={() => { setFile(null); setResult(null); }}
              className="w-full py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Import lagi
            </button>
          )}
        </div>
      )}
    </div>
  );
}
