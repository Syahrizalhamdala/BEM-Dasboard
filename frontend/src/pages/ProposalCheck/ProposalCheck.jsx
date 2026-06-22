import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import UploadProposal from './UploadProposal';
import CheckResult from './CheckResult';
import ProposalHistory from './ProposalHistory';
import GuidelineManager from './GuidelineManager';

const tabs = [
  { id: 'check', label: 'Cek Proposal' },
  { id: 'riwayat', label: 'Riwayat' },
  { id: 'panduan', label: 'Panduan' },
];

export default function ProposalCheck() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const visibleTabs = isAdmin ? tabs : tabs.filter(t => t.id === 'check');
  const [activeTab, setActiveTab] = useState('check');
  const [lastResult, setLastResult] = useState(null);

  useEffect(() => {
    if (!isAdmin && activeTab !== 'check') setActiveTab('check');
  }, [isAdmin, activeTab]);

  const handleCheckDone = (result) => {
    setLastResult(result);
    setActiveTab('riwayat');
  };

  return (
    <div className="space-y-[14px] animate-fade-in">
      <div className="mb-4">
        <h1 className="text-[15px] font-medium text-slate-900">Cek Proposal</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload proposal untuk diperiksa kesesuaiannya dengan panduan BEM
        </p>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 text-sm rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm font-medium'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'check' && (
        <UploadProposal onCheckDone={handleCheckDone} />
      )}

      {activeTab === 'riwayat' && (
        <ProposalHistory highlightId={lastResult?.data?.id} />
      )}

      {activeTab === 'panduan' && (
        <GuidelineManager />
      )}

      {lastResult && (
        <CheckResult
          result={lastResult.data}
          onClose={() => setLastResult(null)}
        />
      )}
    </div>
  );
}
