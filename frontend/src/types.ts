export interface ParcelSummary {
  id: string;
  title: string;
  locality: string;
  city: string;
  overall_status: 'Harmonized' | 'Discrepancy Flagged' | 'Critical Conflict' | 'Verified & Approved' | string;
  confidence_score: number;
  primary_owner: string;
  harmonized_area_sqm: number;
  harmonized_land_use: string;
  conflict_count: number;
  center_lat: number;
  center_lng: number;
  is_human_verified: boolean;
}

export interface LandRevenueRecord {
  source_name: string;
  source_type: string;
  last_updated: string;
  khata_no: string;
  survey_no: string;
  owner_name: string;
  co_owners: string[];
  registered_area_sqm: number;
  area_unit_original: string;
  land_classification: string;
  annual_revenue_inr: number;
  encumbrance: string;
}

export interface CadastralRecord {
  source_name: string;
  source_type: string;
  last_updated: string;
  crs: string;
  cadastral_id: string;
  measured_area_sqm: number;
  perimeter_meters: number;
  boundary_confidence: number;
  coordinates: [number, number][];
  surrounding_parcels: string[];
}

export interface MunicipalTaxRecord {
  source_name: string;
  source_type: string;
  last_updated: string;
  pid: string;
  tax_payer_name: string;
  built_up_area_sqm: number;
  plot_size_sqm: number;
  zone: string;
  land_use_tax: string;
  tax_status: string;
  annual_tax_inr: number;
}

export interface RegistrationRecord {
  source_name: string;
  source_type: string;
  last_updated: string;
  deed_number: string;
  deed_type: string;
  purchaser_name: string;
  seller_name: string;
  conveyed_extent_sqm: number;
  conveyance_value_inr: number;
  stamp_duty_paid: number;
  ocr_confidence: number;
}

export interface GisRecord {
  source_name: string;
  source_type: string;
  last_updated: string;
  gis_uuid: string;
  crs: string;
  computed_area_sqm: number;
  zoning_classification: string;
  road_width_frontage_m: number;
  setback_compliance: string;
}

export interface SatelliteRecord {
  source_name: string;
  source_type: string;
  last_updated: string;
  satellite_ref: string;
  detected_building_footprint_sqm: number;
  open_plot_area_sqm: number;
  total_physical_parcel_sqm: number;
  vegetation_cover_pct: number;
  encroachment_flag: boolean;
  encroachment_details: string;
}

export interface RawParcelDetail {
  id: string;
  title: string;
  locality: string;
  city: string;
  state: string;
  overall_status: string;
  confidence_score: number;
  primary_owner: string;
  harmonized_area_sqm: number;
  harmonized_land_use: string;
  center_lat: number;
  center_lng: number;
  land_revenue: LandRevenueRecord;
  cadastral: CadastralRecord;
  municipal_tax: MunicipalTaxRecord;
  registration: RegistrationRecord;
  gis_dataset: GisRecord;
  satellite: SatelliteRecord;
  verification_audit?: any;
}

export interface ConflictItem {
  code: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  affected_sources: string[];
}

export interface HarmonizationData {
  parcel_id: string;
  overall_status: string;
  confidence_score: number;
  conflicts: ConflictItem[];
  match_metrics: any;
  spatial_metrics: any;
  provenance: any;
}

export interface LlmExplanation {
  parcel_id: string;
  executive_summary: string;
  recommended_actions: string[];
  llm_model: string;
  transparency_guarantee: string;
}

export interface ParcelDetailResponse {
  parcel: RawParcelDetail;
  harmonization: HarmonizationData;
  llm_explanation: LlmExplanation;
  is_human_verified: boolean;
}

export interface AnalyticsData {
  total_properties: number;
  harmonized_count: number;
  discrepancy_flagged_count: number;
  critical_conflict_count: number;
  human_verified_count: number;
  average_confidence_score: number;
  conflict_distribution: Record<string, number>;
  sources_connected: number;
}
