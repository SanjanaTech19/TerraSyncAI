"""
TerraSync AI - Conflict Analysis & Anomaly Detection Module
Scans multi-source property records to detect area, boundary, ownership, land-use, and encumbrance conflicts.
"""

from typing import Dict, Any, List
from .cleaner import parse_and_convert_area_to_sqm

def detect_conflicts(parcel: Dict[str, Any], match_results: Dict[str, Any], spatial_results: Dict[str, Any]) -> List[Dict[str, Any]]:
    conflicts: List[Dict[str, Any]] = []
    
    rev = parcel.get("land_revenue", {})
    cad = parcel.get("cadastral", {})
    tax = parcel.get("municipal_tax", {})
    reg = parcel.get("registration", {})
    gis = parcel.get("gis_dataset", {})
    sat = parcel.get("satellite", {})
    
    # 1. Area Discrepancy Detection
    rev_area = parse_and_convert_area_to_sqm(rev.get("registered_area_sqm", 0))
    cad_area = cad.get("measured_area_sqm", 0)
    tax_area = tax.get("plot_size_sqm", 0)
    reg_area = reg.get("conveyed_extent_sqm", 0)
    sat_area = sat.get("total_physical_parcel_sqm", 0)
    
    all_areas = {"Revenue Records": rev_area, "Cadastral Survey": cad_area, "Municipal Tax": tax_area, "Registration Deed": reg_area, "Satellite AI": sat_area}
    valid_areas = {k: v for k, v in all_areas.items() if v > 0}
    
    if valid_areas:
        max_k, max_v = max(valid_areas.items(), key=lambda x: x[1])
        min_k, min_v = min(valid_areas.items(), key=lambda x: x[1])
        pct_diff = ((max_v - min_v) / max_v) * 100.0 if max_v > 0 else 0
        
        if pct_diff > 4.0:
            conflicts.append({
                "code": "AREA_MISMATCH",
                "severity": "HIGH" if pct_diff > 12.0 else "MEDIUM",
                "title": f"Area Value Discrepancy ({pct_diff:.1f}% Variance)",
                "description": f"Highest recorded area is {max_v} sq.m ({max_k}), while lowest measured area is {min_v} sq.m ({min_k}). Total variance of {max_v - min_v:.1f} sq.m.",
                "affected_sources": [max_k, min_k]
            })

    # 2. Owner Name Mismatch
    owner_sim = match_results.get("owner_matching", {}).get("average_similarity", 1.0)
    if owner_sim < 0.80:
        conflicts.append({
            "code": "OWNER_MISMATCH",
            "severity": "CRITICAL" if owner_sim < 0.60 else "MEDIUM",
            "title": "Property Ownership Name Variance",
            "description": f"Land revenue registered owner '{rev.get('owner_name')}' differs from tax payer '{tax.get('tax_payer_name')}' or deed purchaser '{reg.get('purchaser_name')}'. Matching similarity: {owner_sim*100:.1f}%.",
            "affected_sources": ["Land Revenue Records", "Municipal Tax Database", "Registration Deed"]
        })

    # 3. Spatial Encroachment & Setback Conflict
    if sat.get("encroachment_flag", False):
        conflicts.append({
            "code": "SATELLITE_ENCROACHMENT",
            "severity": "HIGH",
            "title": "Physical Parcel Encroachment Detected",
            "description": sat.get("encroachment_details", "Satellite AI detected physical encroachment beyond cadastral boundary."),
            "affected_sources": ["Cadastral Survey Map", "Satellite Imagery Analytics"]
        })
        
    if spatial_results.get("has_setback_violation", False):
        conflicts.append({
            "code": "SETBACK_RESERVATION",
            "severity": "MEDIUM",
            "title": "Town Planning Setback Reservation Conflict",
            "description": f"GIS Master Plan indicates setback constraint: {gis.get('setback_compliance')}.",
            "affected_sources": ["GIS Master Plan", "Cadastral Survey"]
        })

    # 4. Land Use Classification Conflict
    rev_use = rev.get("land_classification", "").lower()
    tax_use = tax.get("land_use_tax", "").lower()
    gis_use = gis.get("zoning_classification", "").lower()
    
    if ("agricultural" in rev_use or "residential" in rev_use) and ("commercial" in tax_use or "industrial" in tax_use or "commercial" in gis_use):
        conflicts.append({
            "code": "LAND_USE_MISMATCH",
            "severity": "HIGH",
            "title": "Land-Use Zoning Mismatch",
            "description": f"Land Revenue classifies parcel as '{rev.get('land_classification')}', whereas Municipal Tax / GIS zone classifies it as '{tax.get('land_use_tax') or gis.get('zoning_classification')}'. Conversion mutation record may be missing.",
            "affected_sources": ["Land Revenue Records", "Municipal Tax Database", "GIS Master Plan"]
        })

    # 5. Encumbrance / Litigation Alert
    enc = rev.get("encumbrance", "")
    if "litigation" in enc.lower() or "mortgage" in enc.lower():
        conflicts.append({
            "code": "LEGAL_ENCUMBRANCE",
            "severity": "HIGH",
            "title": "Legal Encumbrance or Pending Litigation Flag",
            "description": f"Revenue records list active encumbrance: '{enc}'.",
            "affected_sources": ["Land Revenue Records"]
        })

    return conflicts
