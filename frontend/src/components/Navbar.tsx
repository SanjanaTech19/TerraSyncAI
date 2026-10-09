import React from 'react';
import { Globe2, Layers, CheckSquare, BarChart3, Upload, ShieldCheck, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'matrix' | 'workbench' | 'analytics';
  setActiveTab: (tab: 'map' | 'matrix' | 'workbench' | 'analytics') => void;
  onOpenIngest: () => void;
  selectedParcelId: string | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenIngest,
  selectedParcelId,
  onRefresh,
  isLoading
}) => {
  return (
    <header className="bg-dark-800 border-b border-gray-800 px-6 py-3 sticky top-0 z-50 flex items-center justify-between shadow-xl">
      {/* Brand & Logo */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-1 ring-emerald-400/30">
            <Globe2 className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                TerraSync AI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                GIS Enterprise
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              Multi-Source Urban Land Data Harmonization & Conflict Detection Engine
            </p>
          </div>
        </div>
      </div>

      {/* Navigation View Tabs */}
      <nav className="flex items-center bg-dark-900/90 p-1 rounded-xl border border-gray-800">
        <button
          onClick={() => setActiveTab('map')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs transition-all ${
            activeTab === 'map'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <Globe2 className="h-4 w-4" />
          <span>Interactive GIS Map</span>
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs transition-all ${
            activeTab === 'matrix'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>6-Source Evidence Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('workbench')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs transition-all ${
            activeTab === 'workbench'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          <span>Human Verification Workbench</span>
          {selectedParcelId && (
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-xs transition-all ${
            activeTab === 'analytics'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          <span>AI Insights & Analytics</span>
        </button>
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-white bg-dark-900 border border-gray-800 hover:border-gray-700 rounded-lg transition-all"
          title="Refresh Harmonization Pipeline"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>

        <button
          onClick={onOpenIngest}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-teal-900/30 border border-teal-500/30"
        >
          <Upload className="h-4 w-4" />
          <span>Ingest Source Datasets</span>
        </button>

        <div className="flex items-center gap-2 border-l border-gray-800 pl-3">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded-lg">
            <ShieldCheck className="h-4 w-4" />
            <span className="font-semibold">6 Repositories Connected</span>
          </div>
        </div>
      </div>
    </header>
  );
};
