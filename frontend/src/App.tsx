import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GisMapView } from './components/GisMapView';
import { MultiSourceMatrix } from './components/MultiSourceMatrix';
import { VerificationWorkbench } from './components/VerificationWorkbench';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { IngestionModal } from './components/IngestionModal';
import type { ParcelSummary, ParcelDetailResponse, AnalyticsData } from './types';

const API_BASE = 'http://127.0.0.1:8000/api';

export function App() {
  const [activeTab, setActiveTab] = useState<'map' | 'matrix' | 'workbench' | 'analytics'>('map');
  const [parcels, setParcels] = useState<ParcelSummary[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [parcelDetail, setParcelDetail] = useState<ParcelDetailResponse | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isSubmittingVerify, setIsSubmittingVerify] = useState(false);

  // Fetch list of parcels
  const fetchParcels = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/parcels`);
      const data = await res.json();
      setParcels(data.parcels || []);
      if (data.parcels && data.parcels.length > 0 && !selectedParcelId) {
        setSelectedParcelId(data.parcels[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch parcels:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch detail for selected parcel
  const fetchParcelDetail = async (id: string) => {
    setIsDetailLoading(true);
    try {
      const res = await fetch(`${API_BASE}/parcels/${id}`);
      const data = await res.json();
      setParcelDetail(data);
    } catch (err) {
      console.error('Failed to fetch parcel detail:', err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  useEffect(() => {
    fetchParcels();
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (selectedParcelId) {
      fetchParcelDetail(selectedParcelId);
    }
  }, [selectedParcelId]);

  const handleInspectWorkbench = (id: string) => {
    setSelectedParcelId(id);
    setActiveTab('workbench');
  };

  const handleVerifySubmit = async (payload: any) => {
    if (!selectedParcelId) return;
    setIsSubmittingVerify(true);
    try {
      const res = await fetch(`${API_BASE}/parcels/${selectedParcelId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setParcelDetail(data.result);
      fetchParcels();
      fetchAnalytics();
    } catch (err) {
      console.error('Failed to verify parcel:', err);
    } finally {
      setIsSubmittingVerify(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col font-sans">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenIngest={() => setIsIngestOpen(true)}
        selectedParcelId={selectedParcelId}
        onRefresh={() => {
          fetchParcels();
          fetchAnalytics();
          if (selectedParcelId) fetchParcelDetail(selectedParcelId);
        }}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'map' && (
          <GisMapView
            parcels={parcels}
            selectedParcelId={selectedParcelId}
            onSelectParcel={(id) => setSelectedParcelId(id)}
            onInspectWorkbench={handleInspectWorkbench}
          />
        )}

        {activeTab === 'matrix' && (
          <MultiSourceMatrix
            detail={parcelDetail}
            isLoading={isDetailLoading}
          />
        )}

        {activeTab === 'workbench' && (
          <VerificationWorkbench
            detail={parcelDetail}
            onVerifySubmit={handleVerifySubmit}
            isSubmitting={isSubmittingVerify}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            analytics={analytics}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Multi-Source Ingestion Drawer */}
      <IngestionModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onIngestSuccess={() => {
          fetchParcels();
          fetchAnalytics();
        }}
      />
    </div>
  );
}

export default App;
