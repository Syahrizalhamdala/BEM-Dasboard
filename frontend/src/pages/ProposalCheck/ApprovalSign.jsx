import { useState, useEffect, useRef } from 'react';
import { HiCheckCircle, HiDocumentText, HiDownload, HiXCircle, HiInformationCircle } from 'react-icons/hi';
import { getPendingSignatures, signProposal, downloadSigned } from '../../api/proposalApi';
import SignatureCanvas from 'react-signature-canvas';

export default function ApprovalSign() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [signing, setSigning] = useState(false);
  const [signedResult, setSignedResult] = useState(null);
  const sigRef = useRef(null);

  const fetch = async () => {
    try {
      const data = await getPendingSignatures();
      setPending(data);
    } catch {
      setPending([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const clearSig = () => sigRef.current?.clear();

  const handleSign = async () => {
    if (!sigRef.current || sigRef.current.isEmpty()) return;
    const signatureData = sigRef.current.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
    setSigning(true);

    try {
      const result = await signProposal(selectedId, signatureData);
      setSignedResult(result.data);
      setPending((prev) => prev.filter((c) => c.id !== selectedId));
      setSelectedId(null);
    } catch {
      // silent
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/70 p-5">
        <div className="h-4 w-32 skeleton-shimmer rounded mb-4" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-14 skeleton-shimmer rounded mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-[14px] animate-fade-in">
      <div className="mb-4">
        <h1 className="text-[15px] font-medium text-slate-900">Tanda Tangan Proposal</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          {pending.length} proposal menunggu tanda tangan Presiden Mahasiswa
        </p>
      </div>

      {signedResult ? (
        <div className="bg-white rounded-xl border border-slate-200/70 p-6 text-center">
          <HiCheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-medium text-slate-900 mb-1">Proposal Berhasil Ditandatangani</h3>
          <p className="text-sm text-slate-500 mb-4">Surat pengesahan telah diterbitkan.</p>
          <button
            onClick={() => downloadSigned(signedResult.check.id)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy text-white text-sm rounded-xl hover:bg-burgundy-dark transition-all"
          >
            <HiDownload className="w-4 h-4" />
            Download Surat Pengesahan
          </button>
          <button
            onClick={() => { setSignedResult(null); fetch(); }}
            className="block mx-auto mt-3 text-xs text-slate-400 hover:text-slate-600"
          >
            Kembali
          </button>
        </div>
      ) : pending.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/70 p-8 text-center">
          <HiCheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Tidak ada proposal yang menunggu tanda tangan</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200/70 p-5">
              <h3 className="text-sm font-medium text-slate-900 mb-3">Daftar Proposal</h3>
              <div className="space-y-1.5">
                {pending.map((check) => (
                  <div
                    key={check.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedId === check.id
                        ? 'bg-burgundy/10 ring-1 ring-burgundy/20'
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => { setSelectedId(check.id); clearSig(); }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <HiDocumentText className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-900">{check.nama_file}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(check.created_at).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedId ? (
              <div className="bg-white rounded-xl border border-slate-200/70 p-5">
                <h3 className="text-sm font-medium text-slate-900 mb-3">Tanda Tangan</h3>
                <div className="border border-slate-200 rounded-lg bg-white mb-3">
                  <SignatureCanvas
                    ref={sigRef}
                    penColor="#1a1a1a"
                    canvasProps={{
                      className: 'w-full h-32 rounded-lg',
                    }}
                  />
                </div>
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={clearSig}
                    className="flex-1 px-3 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={handleSign}
                    disabled={signing}
                    className="flex-1 px-3 py-1.5 bg-burgundy text-white text-xs rounded-lg hover:bg-burgundy-dark disabled:opacity-50 transition-all"
                  >
                    {signing ? 'Memproses...' : 'Tanda Tangani'}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center">
                  Tanda tangan dengan mouse atau touchscreen
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200/70 p-5">
                <div className="flex items-start gap-2.5">
                  <HiInformationCircle className="w-4 h-4 text-burgundy/80 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-500">
                    Pilih proposal di daftar untuk menandatangani
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
