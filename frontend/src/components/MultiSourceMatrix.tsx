import React from 'react';
import type { ParcelDetailResponse } from '../types';
import { Database, Map, FileText, Satellite, Globe, AlertTriangle } from 'lucide-react';

interface MultiSourceMatrixProps {
  detail: ParcelDetailResponse | null;
  isLoading: boolean;
}

export const MultiSourceMatrix: React.FC<MultiSourceMatrixProps> = ({ detail, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-gray-400">Harmonizing 6 Multi-Source Data Repositories...</span>
        </div>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)] text-gray-400 text-sm">
        Please select a property from the map or list to view multi-source evidence matrix.
      </div>
    );
  }

  const { parcel, harmonization } = detail;
  const { land_revenue, cadastral, municipal_tax, registration, gis_dataset, satellite } = parcel;

  const sources = [
    {
      name: '1. Land Revenue Records',
      type: 'CSV / Bhoomi DB',
      icon: Database,
      color: 'from-blue-600 to-indigo-700',
      id_val: land_revenue.khata_no,
      owner_val: land_revenue.owner_name,
      area_val: `${land_revenue.registered_area_sqm} sq.m`,
      use_val: land_revenue.land_classification,
      status: 'Authoritative Title',
      extra_label: 'Encumbrance',
      extra_val: land_revenue.encumbrance
    },
    {
      name: '2. Cadastral Survey Map',
      type: 'GeoJSON / SSLR Vector',
      icon: Map,
      color: 'from-emerald-600 to-teal-700',
      id_val: cadastral.cadastral_id,
      owner_val: land_revenue.owner_name,
      area_val: `${cadastral.measured_area_sqm} sq.m`,
      use_val: 'Cadastral Boundary Extent',
      status: 'Ground Survey',
      extra_label: 'Perimeter',
      extra_val: `${cadastral.perimeter_meters} meters`
    },
    {
      name: '3. Municipal Property Tax',
      type: 'REST API / JSON',
      icon: FileText,
      color: 'from-purple-600 to-pink-700',
      id_val: municipal_tax.pid,
      owner_val: municipal_tax.tax_payer_name,
      area_val: `${municipal_tax.plot_size_sqm} sq.m`,
      use_val: municipal_tax.land_use_tax,
      status: municipal_tax.tax_status,
      extra_label: 'Built-up Extent',
      extra_val: `${municipal_tax.built_up_area_sqm} sq.m`
    },
    {
      name: '4. Sub-Registrar Deed',
      type: 'Deed OCR PDF',
      icon: FileText,
      color: 'from-amber-600 to-orange-700',
      id_val: registration.deed_number,
      owner_val: registration.purchaser_name,
      area_val: `${registration.conveyed_extent_sqm} sq.m`,
      use_val: registration.deed_type,
      status: `OCR Confidence ${(registration.ocr_confidence * 100).toFixed(0)}%`,
      extra_label: 'Stamp Value',
      extra_val: `₹${(registration.conveyance_value_inr / 100000).toFixed(1)} Lakhs`
    },
    {
      name: '5. GIS Master Plan',
      type: 'Spatial Shapefile',
      icon: Globe,
      color: 'from-cyan-600 to-blue-700',
      id_val: gis_dataset.gis_uuid,
      owner_val: 'Zoning Registry',
      area_val: `${gis_dataset.computed_area_sqm} sq.m`,
      use_val: gis_dataset.zoning_classification,
      status: gis_dataset.setback_compliance,
      extra_label: 'Frontage Road',
      extra_val: `${gis_dataset.road_width_frontage_m} meters`
    },
    {
      name: '6. Satellite AI Analytics',
      type: 'Raster AI Segmentation',
      icon: Satellite,
      color: 'from-rose-600 to-red-700',
      id_val: satellite.satellite_ref,
      owner_val: 'Physical AI Scan',
      area_val: `${satellite.total_physical_parcel_sqm} sq.m`,
      use_val: `Roof Footprint: ${satellite.detected_building_footprint_sqm} sq.m`,
      status: satellite.encroachment_flag ? 'Encroachment Flagged' : 'Normal Boundaries',
      extra_label: 'Vegetation %',
      extra_val: `${satellite.vegetation_cover_pct}%`
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-dark-800 via-dark-900 to-dark-800 border border-gray-800 p-6 rounded-2xl shadow-xl flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-800">
              6-Source Multi-Evidence Matrix
            </span>
            <span className="text-xs text-gray-500 font-mono">ID: {parcel.id}</span>
          </div>
          <h2 className="text-xl font-black text-white">{parcel.title}</h2>
          <p className="text-xs text-gray-400 mt-1">
            Reconciling disparate data formats, varying IDs, spelling typos, and coordinate projections into one evidence-backed record.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-dark-950/80 border border-gray-800 p-4 rounded-xl">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Harmonized Confidence</span>
            <span className={`text-2xl font-black ${harmonization.confidence_score > 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {harmonization.confidence_score}%
            </span>
          </div>
          <div className="h-10 w-[1px] bg-gray-800" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-gray-500 block">Overall Status</span>
            <span className="text-xs font-extrabold text-white bg-emerald-950 border border-emerald-700 px-2.5 py-1 rounded-lg">
              {harmonization.overall_status}
            </span>
          </div>
        </div>
      </div>

      {/* Discrepancy Conflicts Notification Box if any */}
      {harmonization.conflicts.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-800/80 p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <AlertTriangle className="h-4 w-4" />
            <span>Automated AI Conflict Analysis Detected {harmonization.conflicts.length} Silo Inconsistencies</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {harmonization.conflicts.map((c, idx) => (
              <div key={idx} className="bg-dark-900/90 border border-amber-900/50 p-3 rounded-lg text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-200">{c.title}</span>
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${c.severity === 'CRITICAL' ? 'bg-red-900 text-red-300' : 'bg-amber-900 text-amber-300'}`}>
                    {c.severity}
                  </span>
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6 Grid Cards for 6 Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sources.map((src, index) => {
          const Icon = src.icon;
          return (
            <div
              key={index}
              className="bg-dark-800/90 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${src.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black text-white">{src.name}</h3>
                      <span className="text-[10px] text-gray-400 font-medium">{src.type}</span>
                    </div>
                  </div>
                </div>

                {/* Data Fields */}
                <div className="space-y-2.5 text-xs">
                  <div className="bg-dark-950/60 p-2.5 rounded-lg border border-gray-800/80">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Source ID / Khata / PID</span>
                    <span className="font-mono text-gray-200 font-medium">{src.id_val}</span>
                  </div>

                  <div className="bg-dark-950/60 p-2.5 rounded-lg border border-gray-800/80">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Owner / Purchaser Name</span>
                    <span className="font-semibold text-white">{src.owner_val}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-dark-950/60 p-2.5 rounded-lg border border-gray-800/80">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">Parcel Extent / Area</span>
                      <span className="font-extrabold text-emerald-400">{src.area_val}</span>
                    </div>

                    <div className="bg-dark-950/60 p-2.5 rounded-lg border border-gray-800/80">
                      <span className="text-[10px] text-gray-500 uppercase font-semibold block">{src.extra_label}</span>
                      <span className="font-medium text-gray-300">{src.extra_val}</span>
                    </div>
                  </div>

                  <div className="bg-dark-950/60 p-2.5 rounded-lg border border-gray-800/80">
                    <span className="text-[10px] text-gray-500 uppercase font-semibold block">Land Use / Zoning Classification</span>
                    <span className="font-medium text-gray-300">{src.use_val}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Status */}
              <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-[11px]">
                <span className="text-gray-500">Source Lineage Status:</span>
                <span className="font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  {src.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
