import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { ParcelSummary } from '../types';
import { Layers, ShieldCheck, AlertTriangle, ArrowRight, Compass } from 'lucide-react';

interface GisMapViewProps {
  parcels: ParcelSummary[];
  selectedParcelId: string | null;
  onSelectParcel: (id: string) => void;
  onInspectWorkbench: (id: string) => void;
}

export const GisMapView: React.FC<GisMapViewProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
  onInspectWorkbench
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map centered on Bangalore Central Urban Area
      const map = L.map(mapContainerRef.current, {
        center: [12.9600, 77.6300],
        zoom: 12,
        zoomControl: false
      });

      // Dark Matter Map Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO &copy; SSLR Cadastral AI',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      polygonGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }
  }, []);

  // Render parcel markers and polygon boundaries
  useEffect(() => {
    if (!mapInstanceRef.current || !polygonGroupRef.current) return;

    const layerGroup = polygonGroupRef.current;
    layerGroup.clearLayers();

    parcels.forEach(parcel => {
      const isSelected = parcel.id === selectedParcelId;
      
      let fillColor = '#10b981'; // Green: Harmonized
      let strokeColor = '#059669';

      if (parcel.overall_status === 'Discrepancy Flagged') {
        fillColor = '#f59e0b'; // Yellow
        strokeColor = '#d97706';
      } else if (parcel.overall_status === 'Critical Conflict') {
        fillColor = '#ef4444'; // Red
        strokeColor = '#dc2626';
      } else if (parcel.overall_status === 'Verified & Approved') {
        fillColor = '#06b6d4'; // Cyan
        strokeColor = '#0284c7';
      }

      // Bounding box polygon around parcel center
      const offset = 0.0015;
      const bounds: [number, number][] = [
        [parcel.center_lat + offset, parcel.center_lng - offset],
        [parcel.center_lat + offset, parcel.center_lng + offset],
        [parcel.center_lat - offset, parcel.center_lng + offset],
        [parcel.center_lat - offset, parcel.center_lng - offset]
      ];

      const polygon = L.polygon(bounds, {
        color: isSelected ? '#ffffff' : strokeColor,
        weight: isSelected ? 3 : 2,
        fillColor: fillColor,
        fillOpacity: isSelected ? 0.6 : 0.35,
        dashArray: parcel.overall_status === 'Critical Conflict' ? '6, 6' : undefined
      });

      polygon.on('click', () => {
        onSelectParcel(parcel.id);
      });

      // Custom marker icon
      const customIcon = L.divIcon({
        className: 'custom-parcel-marker',
        html: `
          <div style="
            background: ${fillColor}; 
            color: #000; 
            font-weight: 800; 
            font-size: 10px; 
            padding: 3px 8px; 
            border-radius: 9999px; 
            border: 2px solid #fff; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            white-space: nowrap;
          ">
            ${parcel.id} (${parcel.confidence_score}%)
          </div>
        `,
        iconSize: [80, 24],
        iconAnchor: [40, 12]
      });

      const marker = L.marker([parcel.center_lat, parcel.center_lng], { icon: customIcon });
      marker.on('click', () => {
        onSelectParcel(parcel.id);
      });

      layerGroup.addLayer(polygon);
      layerGroup.addLayer(marker);
    });
  }, [parcels, selectedParcelId, onSelectParcel]);

  // Center map on selected parcel
  useEffect(() => {
    if (!selectedParcelId || !mapInstanceRef.current) return;
    const target = parcels.find(p => p.id === selectedParcelId);
    if (target) {
      mapInstanceRef.current.flyTo([target.center_lat, target.center_lng], 14, { duration: 1.2 });
    }
  }, [selectedParcelId, parcels]);

  const selectedParcel = parcels.find(p => p.id === selectedParcelId);

  return (
    <div className="relative w-full h-[calc(100vh-65px)] flex overflow-hidden">
      {/* Map Container */}
      <div className="flex-1 relative h-full">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Floating Map Overlay Controls */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 bg-dark-900/90 backdrop-blur-md p-3 rounded-xl border border-gray-800 shadow-2xl max-w-xs">
          <div className="flex items-center justify-between border-b border-gray-800 pb-2">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-400" />
              GIS Multi-Source Map Layers
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-gray-400">
            <label className="flex items-center gap-2 hover:text-white cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-0" />
              <span>Cadastral Survey Vectors (SSLR)</span>
            </label>
            <label className="flex items-center gap-2 hover:text-white cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-0" />
              <span>Satellite Building Footprints (AI)</span>
            </label>
            <label className="flex items-center gap-2 hover:text-white cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-0" />
              <span>Municipal Tax Assessment Zones</span>
            </label>
            <label className="flex items-center gap-2 hover:text-white cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-0" />
              <span>Discrepancy Overlap Heatmap</span>
            </label>
          </div>
        </div>

        {/* Status Legend */}
        <div className="absolute bottom-6 left-4 z-10 flex items-center gap-4 bg-dark-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-gray-800 shadow-2xl text-xs">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
            <span className="text-gray-300 font-medium">Harmonized (&gt;88%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500" />
            <span className="text-gray-300 font-medium">Discrepancy Flagged</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 shadow-sm shadow-red-500 animate-pulse" />
            <span className="text-gray-300 font-medium">Critical Conflict (&lt;65%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
            <span className="text-gray-300 font-medium">Human Verified</span>
          </div>
        </div>
      </div>

      {/* Right Sidebar: Parcel Selection Inspector */}
      <div className="w-96 bg-dark-800 border-l border-gray-800 flex flex-col h-full z-10 shadow-2xl">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-emerald-400" />
            Urban Property Inspector
          </span>
          <span className="text-xs text-gray-500 font-medium">{parcels.length} Properties Analyzed</span>
        </div>

        {/* List of Parcels */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {parcels.map(p => {
            const isSelected = p.id === selectedParcelId;
            let statusBadgeClass = 'bg-emerald-950 text-emerald-400 border-emerald-800';
            if (p.overall_status === 'Discrepancy Flagged') statusBadgeClass = 'bg-amber-950 text-amber-400 border-amber-800';
            if (p.overall_status === 'Critical Conflict') statusBadgeClass = 'bg-red-950 text-red-400 border-red-800';
            if (p.overall_status === 'Verified & Approved') statusBadgeClass = 'bg-cyan-950 text-cyan-400 border-cyan-800';

            return (
              <div
                key={p.id}
                onClick={() => onSelectParcel(p.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-dark-700/80 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                    : 'bg-dark-900/60 border-gray-800 hover:border-gray-700 hover:bg-dark-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-white">{p.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadgeClass}`}>
                    {p.overall_status}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-gray-200 line-clamp-1 mb-1">
                  {p.title}
                </h4>

                <div className="grid grid-cols-2 gap-2 my-2 text-[11px] text-gray-400 bg-dark-950/40 p-2 rounded-lg border border-gray-800/60">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Primary Owner</span>
                    <span className="font-medium text-gray-200 truncate block">{p.primary_owner}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Harmonized Extent</span>
                    <span className="font-semibold text-emerald-400">{p.harmonized_area_sqm} sq.m</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">AI Confidence:</span>
                    <span className={`font-bold ${p.confidence_score > 85 ? 'text-emerald-400' : p.confidence_score > 65 ? 'text-amber-400' : 'text-red-400'}`}>
                      {p.confidence_score}%
                    </span>
                  </div>

                  {p.conflict_count > 0 ? (
                    <span className="text-amber-400 font-medium flex items-center gap-1 text-[10px]">
                      <AlertTriangle className="h-3 w-3" />
                      {p.conflict_count} Conflicts
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium flex items-center gap-1 text-[10px]">
                      <ShieldCheck className="h-3 w-3" />
                      Consistent
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Parcel Quick CTA Footer */}
        {selectedParcel && (
          <div className="p-4 border-t border-gray-800 bg-dark-900/90 backdrop-blur-md">
            <div className="mb-3">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-0.5">Selected Property</span>
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>{selectedParcel.id} - {selectedParcel.title}</span>
              </div>
            </div>

            <button
              onClick={() => onInspectWorkbench(selectedParcel.id)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-lg shadow-emerald-900/40 border border-emerald-500/30"
            >
              <span>Inspect Evidence & Verify Record</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
