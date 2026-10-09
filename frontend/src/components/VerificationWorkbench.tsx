import React, { useState, useEffect } from 'react';
import type { ParcelDetailResponse } from '../types';
import { CheckSquare, ShieldCheck, CheckCircle, User, Ruler, FileText } from 'lucide-react';

interface VerificationWorkbenchProps {
  detail: ParcelDetailResponse | null;
  onVerifySubmit: (payload: {
    verified_by: string;
    official_designation: string;
    approved_owner_name: string;
    approved_area_sqm: number;
    approved_land_use: string;
    resolution_notes: string;
    action: 'APPROVE' | 'FLAG_SURVEY' | 'REJECT';
  }) => void;
  isSubmitting: boolean;
}

export const VerificationWorkbench: React.FC<VerificationWorkbenchProps> = ({
  detail,
  onVerifySubmit,
  isSubmitting
}) => {
  const [officialName, setOfficialName] = useState('S. Venkatesh, KAS');
  const [designation, setDesignation] = useState('Assistant Revenue Officer (ARO)');
  const [approvedOwner, setApprovedOwner] = useState('');
  const [approvedArea, setApprovedArea] = useState<number>(0);
  const [approvedLandUse, setApprovedLandUse] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (detail) {
      const p = detail.parcel;
      setApprovedOwner(p.primary_owner);
      setApprovedArea(p.harmonized_area_sqm);
      setApprovedLandUse(p.harmonized_land_use);
      setNotes(`Reviewed multi-source discrepancies for parcel ${p.id}. Ground survey extent and Sub-Registrar deed reconciled.`);
    }
  }, [detail]);

  if (!detail) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)] text-gray-400 text-sm">
        Please select a property to open the Human Verification Workbench.
      </div>
    );
  }

  const { parcel, harmonization, llm_explanation, is_human_verified } = detail;
  const { land_revenue, cadastral, municipal_tax, registration } = parcel;

  const handleAction = (actionType: 'APPROVE' | 'FLAG_SURVEY' | 'REJECT') => {
    onVerifySubmit({
      verified_by: officialName,
      official_designation: designation,
      approved_owner_name: approvedOwner,
      approved_area_sqm: Number(approvedArea),
      approved_land_use: approvedLandUse,
      resolution_notes: notes,
      action: actionType
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-dark-800 via-dark-900 to-dark-800 border border-gray-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-widest text-teal-400 bg-teal-950/80 px-2.5 py-0.5 rounded-md border border-teal-800 flex items-center gap-1">
              <CheckSquare className="h-3.5 w-3.5" />
              Human-in-the-Loop Workbench
            </span>
            {is_human_verified && (
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950 border border-cyan-800 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" />
                Verified & Approved
              </span>
            )}
          </div>
          <h2 className="text-xl font-black text-white">{parcel.title}</h2>
          <p className="text-xs text-gray-400 mt-1">
            Authorized municipal officials retain final control to review AI recommendations and commit final single source of truth.
          </p>
        </div>

        <div className="bg-dark-950 border border-gray-800 p-4 rounded-xl text-right">
          <span className="text-[10px] uppercase font-bold text-gray-500 block">Current Confidence Score</span>
          <span className={`text-2xl font-black ${harmonization.confidence_score > 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {harmonization.confidence_score}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Side-by-Side Source Discrepancies (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-dark-800 border border-gray-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider border-b border-gray-800 pb-3 flex items-center justify-between">
              <span>1. Property Owner Resolution</span>
              <User className="h-4 w-4 text-emerald-400" />
            </h3>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-dark-950 p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-500 block font-semibold">Land Revenue</span>
                <span className="font-semibold text-white block mt-0.5">{land_revenue.owner_name}</span>
              </div>
              <div className="bg-dark-950 p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-500 block font-semibold">Municipal Tax</span>
                <span className="font-semibold text-white block mt-0.5">{municipal_tax.tax_payer_name}</span>
              </div>
              <div className="bg-dark-950 p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-500 block font-semibold">Deed Registry</span>
                <span className="font-semibold text-white block mt-0.5">{registration.purchaser_name}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-400 block mb-1">
                Approved Owner Name (Single Source of Truth)
              </label>
              <input
                type="text"
                value={approvedOwner}
                onChange={(e) => setApprovedOwner(e.target.value)}
                className="w-full bg-dark-950 border border-emerald-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>
          </div>

          <div className="bg-dark-800 border border-gray-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider border-b border-gray-800 pb-3 flex items-center justify-between">
              <span>2. Parcel Area Extent Resolution (sq.meters)</span>
              <Ruler className="h-4 w-4 text-emerald-400" />
            </h3>

            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-dark-950 p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-500 block font-semibold">Revenue Extent</span>
                <span className="font-extrabold text-white block mt-0.5">{land_revenue.registered_area_sqm} sq.m</span>
              </div>
              <div className="bg-dark-950 p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-500 block font-semibold">Cadastral Survey</span>
                <span className="font-extrabold text-emerald-400 block mt-0.5">{cadastral.measured_area_sqm} sq.m</span>
              </div>
              <div className="bg-dark-950 p-3 rounded-xl border border-gray-800">
                <span className="text-[10px] text-gray-500 block font-semibold">Municipal Plot</span>
                <span className="font-extrabold text-white block mt-0.5">{municipal_tax.plot_size_sqm} sq.m</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-emerald-400 block mb-1">
                Approved Final Parcel Area (sq.m)
              </label>
              <input
                type="number"
                value={approvedArea}
                onChange={(e) => setApprovedArea(parseFloat(e.target.value))}
                className="w-full bg-dark-950 border border-emerald-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>
          </div>

          <div className="bg-dark-800 border border-gray-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-gray-200 uppercase tracking-wider border-b border-gray-800 pb-3 flex items-center justify-between">
              <span>3. Land Use & Zoning Classification</span>
              <FileText className="h-4 w-4 text-emerald-400" />
            </h3>

            <div>
              <label className="text-xs font-bold text-emerald-400 block mb-1">
                Approved Authoritative Land Use
              </label>
              <input
                type="text"
                value={approvedLandUse}
                onChange={(e) => setApprovedLandUse(e.target.value)}
                className="w-full bg-dark-950 border border-emerald-800/80 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Right Column: AI Rationale & Official Sign-off Action (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* AI Explanation Card */}
          <div className="bg-dark-800 border border-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                AI Reasoning & Recommendation
              </span>
              <span className="text-[10px] text-gray-500 font-mono">{llm_explanation.llm_model}</span>
            </div>

            <div className="text-xs text-gray-300 leading-relaxed space-y-2 whitespace-pre-line bg-dark-950/70 p-3.5 rounded-xl border border-gray-800">
              {llm_explanation.executive_summary}
            </div>
          </div>

          {/* Verification Sign-Off Form */}
          <div className="bg-dark-800 border border-gray-800 p-5 rounded-2xl space-y-4">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider border-b border-gray-800 pb-3">
              Official Sign-Off & Audit Trail
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Verifying Official Name</label>
                <input
                  type="text"
                  value={officialName}
                  onChange={(e) => setOfficialName(e.target.value)}
                  className="w-full bg-dark-950 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-400 block mb-1">Official Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full bg-dark-950 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Official Resolution Notes</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-dark-950 border border-gray-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleAction('APPROVE')}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg transition-all border border-emerald-500/30"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Approve & Sync to Authoritative PostGIS Record</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAction('FLAG_SURVEY')}
                  disabled={isSubmitting}
                  className="bg-amber-950/80 hover:bg-amber-900 border border-amber-700 text-amber-300 font-semibold text-xs py-2 px-3 rounded-xl transition-all"
                >
                  Flag for Field Survey
                </button>
                <button
                  onClick={() => handleAction('REJECT')}
                  disabled={isSubmitting}
                  className="bg-red-950/80 hover:bg-red-900 border border-red-700 text-red-300 font-semibold text-xs py-2 px-3 rounded-xl transition-all"
                >
                  Reject & Re-open Silo Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
