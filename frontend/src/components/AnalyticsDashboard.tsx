import React from 'react';
import type { AnalyticsData } from '../types';
import { BarChart3, ShieldCheck, CheckCircle, Activity, Database, ArrowUpRight } from 'lucide-react';

interface AnalyticsDashboardProps {
  analytics: AnalyticsData | null;
  isLoading: boolean;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics, isLoading }) => {
  if (isLoading || !analytics) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-400">Computing Urban GIS Data Analytics...</span>
        </div>
      </div>
    );
  }

  const {
    total_properties,
    harmonized_count,
    discrepancy_flagged_count,
    critical_conflict_count,
    human_verified_count,
    average_confidence_score,
    conflict_distribution,
    sources_connected
  } = analytics;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-800 via-dark-900 to-dark-800 border border-gray-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800 flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              Executive Analytics & AI Diagnostics
            </span>
          </div>
          <h2 className="text-xl font-black text-white">Urban Land Data Harmonization Intelligence</h2>
          <p className="text-xs text-gray-400 mt-1">
            Real-time analytics monitoring data reconciliation quality, spatial overlap anomalies, and municipal verification rates.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-dark-950 border border-gray-800 p-3.5 rounded-xl">
          <Activity className="h-5 w-5 text-emerald-400 animate-pulse" />
          <div>
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Ingestion Pipeline</span>
            <span className="text-xs font-extrabold text-emerald-400">Active & Syncing</span>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-800 border border-gray-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase">Total Analyzed</span>
            <Database className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{total_properties}</div>
          <span className="text-[11px] text-gray-400 mt-1 block">Across {sources_connected} Data Silos</span>
        </div>

        <div className="bg-dark-800 border border-gray-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase">Average Confidence</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">{average_confidence_score}%</div>
          <span className="text-[11px] text-emerald-400/80 mt-1 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" /> +14.2% higher reliability
          </span>
        </div>

        <div className="bg-dark-800 border border-gray-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase">Harmonized Records</span>
            <CheckCircle className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-teal-400">{harmonized_count}</div>
          <span className="text-[11px] text-teal-400/80 mt-1 block font-medium">
            {((harmonized_count / total_properties) * 100).toFixed(0)}% auto-matched
          </span>
        </div>

        <div className="bg-dark-800 border border-gray-800 p-5 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold uppercase">Human Verified</span>
            <ShieldCheck className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400">{human_verified_count}</div>
          <span className="text-[11px] text-cyan-400/80 mt-1 block font-medium">
            Committed to Master Ledger
          </span>
        </div>
      </div>

      {/* Charts / Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Breakdown (6 cols) */}
        <div className="lg:col-span-6 bg-dark-800 border border-gray-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-gray-800 pb-3">
            Property Status Distribution
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 font-medium flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  Harmonized & High Confidence
                </span>
                <span className="font-extrabold text-white">{harmonized_count} ({((harmonized_count / total_properties) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-dark-950 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(harmonized_count / total_properties) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 font-medium flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  Minor Discrepancy Flagged
                </span>
                <span className="font-extrabold text-white">{discrepancy_flagged_count} ({((discrepancy_flagged_count / total_properties) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-dark-950 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(discrepancy_flagged_count / total_properties) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 font-medium flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  Critical Conflict Flagged
                </span>
                <span className="font-extrabold text-white">{critical_conflict_count} ({((critical_conflict_count / total_properties) * 100).toFixed(0)}%)</span>
              </div>
              <div className="w-full bg-dark-950 h-2.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${(critical_conflict_count / total_properties) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Conflict Type Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-dark-800 border border-gray-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-gray-800 pb-3">
            Detected Conflict Category Breakdown
          </h3>

          <div className="space-y-3.5 text-xs">
            {Object.entries(conflict_distribution).map(([code, count]) => {
              const labelMap: Record<string, string> = {
                AREA_MISMATCH: 'Area Extent Discrepancy (>4% Variance)',
                OWNER_MISMATCH: 'Owner Name / Title Spelling Mismatch',
                SATELLITE_ENCROACHMENT: 'Physical Satellite Encroachment Anomaly',
                LAND_USE_MISMATCH: 'Zoning & Land-Use Classification Mismatch',
                LEGAL_ENCUMBRANCE: 'Pending Legal Encumbrance / Court Notice'
              };
              return (
                <div key={code} className="flex items-center justify-between bg-dark-950 p-3 rounded-xl border border-gray-800">
                  <span className="text-gray-300 font-medium">{labelMap[code] || code}</span>
                  <span className="font-extrabold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
                    {count} Incidents
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
