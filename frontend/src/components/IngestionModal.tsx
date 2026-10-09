import React, { useState } from 'react';
import { Upload, CheckCircle2, RefreshCw, X, ArrowRight } from 'lucide-react';

interface IngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestSuccess: () => void;
}

export const IngestionModal: React.FC<IngestionModalProps> = ({ isOpen, onClose, onIngestSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const pipelineSteps = [
    '1. Multi-Source Ingestion (CSV, GeoJSON, Deed PDFs)',
    '2. Data Cleaning & Unit Standardization (sq.ft → sq.m)',
    '3. AI Property Entity Resolution (Vector Embeddings)',
    '4. Spatial & CRS Reprojection (WGS84 Alignment)',
    '5. Automated Topological Intersection & Conflict Scan',
    '6. Evidence Harmonization & Confidence Calculation'
  ];

  const handleSimulatedIngest = () => {
    setIsProcessing(true);
    setCurrentStep(1);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            onIngestSuccess();
            onClose();
          }, 800);
          return 6;
        }
        return prev + 1;
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-dark-800 border border-gray-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-lg">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Multi-Source Data Ingestion Engine</h3>
              <p className="text-xs text-gray-400">Upload CSV, GeoJSON, PDF, Shapefiles, or Satellite datasets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Upload Zone */}
        {!isProcessing ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-700 hover:border-emerald-500/80 rounded-2xl p-8 text-center transition-all cursor-pointer bg-dark-950/50">
              <Upload className="h-10 w-10 text-emerald-400 mx-auto mb-3 animate-bounce" />
              <h4 className="text-xs font-bold text-gray-200">Drag & Drop multi-source land files here</h4>
              <p className="text-[11px] text-gray-500 mt-1">Supports CSV (Bhoomi), GeoJSON (Cadastral), PDF (Deed OCR), Shapefiles</p>
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <label
                htmlFor="file-upload"
                className="inline-block mt-4 text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-4 py-2 rounded-xl hover:bg-emerald-900 cursor-pointer"
              >
                Select Files from Disk
              </label>
            </div>

            {file && (
              <div className="bg-dark-950 p-3 rounded-xl border border-gray-800 flex items-center justify-between text-xs">
                <span className="font-semibold text-white truncate max-w-xs">{file.name}</span>
                <span className="text-emerald-400 font-bold">{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            )}

            <button
              onClick={handleSimulatedIngest}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-lg transition-all"
            >
              <span>Trigger Automated Ingestion & Harmonization</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* Processing Pipeline Animation */
          <div className="space-y-4 py-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-widest">
                Running TerraSync Pipeline (Step {currentStep}/6)
              </span>
              <h4 className="text-sm font-bold text-white">Ingesting & Reconciling Urban Land Repositories</h4>
            </div>

            <div className="space-y-2.5">
              {pipelineSteps.map((stepName, idx) => {
                const stepNum = idx + 1;
                const isDone = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                      isDone
                        ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                        : isCurrent
                        ? 'bg-teal-950/80 border-teal-500 text-white shadow-md'
                        : 'bg-dark-950/40 border-gray-800/60 text-gray-600'
                    }`}
                  >
                    <span>{stepName}</span>
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <RefreshCw className="h-4 w-4 text-teal-400 animate-spin" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-gray-700" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
