"""
TerraSync AI - Evidence-Based Harmonization & Confidence Scoring Engine
Merges disparate sources, calculates confidence scores (0-100%), and tracks field provenance.
"""

from typing import Dict, Any, List

def calculate_confidence_score(conflicts: List[Dict[str, Any]], match_results: Dict[str, Any], spatial_results: Dict[str, Any]) -> float:
    base_score = 100.0
    
    # Deductions for conflicts
    for c in conflicts:
        sev = c.get("severity", "MEDIUM")
        if sev == "CRITICAL":
            base_score -= 25.0
        elif sev == "HIGH":
            base_score -= 15.0
        elif sev == "MEDIUM":
            base_score -= 8.0
        else:
            base_score -= 4.0
            
    # Reward high spatial IoU and owner match
    owner_sim = match_results.get("owner_matching", {}).get("average_similarity", 0.8)
    spatial_iou = spatial_results.get("spatial_iou", 0.9)
    
    score = (base_score * 0.6) + (owner_sim * 20.0) + (spatial_iou * 20.0)
    score = max(10.0, min(99.5, score))
    return round(score, 1)

def harmonize_property(parcel: Dict[str, Any], match_results: Dict[str, Any], spatial_results: Dict[str, Any], conflicts: List[Dict[str, Any]]) -> Dict[str, Any]:
    score = calculate_confidence_score(conflicts, match_results, spatial_results)
    
    if score >= 88.0 and not any(c["severity"] in ["CRITICAL", "HIGH"] for c in conflicts):
        status = "Harmonized"
    elif score >= 65.0:
        status = "Discrepancy Flagged"
    else:
        status = "Critical Conflict"
        
    rev = parcel.get("land_revenue", {})
    cad = parcel.get("cadastral", {})
    tax = parcel.get("municipal_tax", {})
    reg = parcel.get("registration", {})
    gis = parcel.get("gis_dataset", {})
    sat = parcel.get("satellite", {})
    
    # Field Provenance Lineage
    provenance = {
        "primary_owner": {
            "harmonized_value": rev.get("owner_name") or tax.get("tax_payer_name"),
            "confidence": match_results.get("owner_matching", {}).get("average_similarity", 0.9),
            "sources": {
                "Land Revenue": rev.get("owner_name"),
                "Municipal Tax": tax.get("tax_payer_name"),
                "Registration Deed": reg.get("purchaser_name")
            },
            "status": "MATCHED" if match_results.get("is_owner_matched") else "DISCREPANCY"
        },
        "parcel_area_sqm": {
            "harmonized_value": cad.get("measured_area_sqm") or gis.get("computed_area_sqm") or parcel.get("harmonized_area_sqm"),
            "confidence": round(1.0 - spatial_results.get("area_discrepancy_ratio", 0.0), 2),
            "sources": {
                "Land Revenue (Registered)": rev.get("registered_area_sqm"),
                "Cadastral Map (Measured)": cad.get("measured_area_sqm"),
                "Municipal Tax (Plot Size)": tax.get("plot_size_sqm"),
                "Registration Deed (Conveyed)": reg.get("conveyed_extent_sqm"),
                "GIS Dataset (Computed)": gis.get("computed_area_sqm"),
                "Satellite AI (Footprint)": sat.get("total_physical_parcel_sqm")
            },
            "status": "VERIFIED" if spatial_results.get("area_discrepancy_ratio", 0.0) < 0.05 else "DISCREPANCY"
        },
        "land_use": {
            "harmonized_value": gis.get("zoning_classification") or tax.get("land_use_tax") or rev.get("land_classification"),
            "confidence": 0.85,
            "sources": {
                "Land Revenue": rev.get("land_classification"),
                "Municipal Tax": tax.get("land_use_tax"),
                "GIS Master Plan": gis.get("zoning_classification")
            },
            "status": "VERIFIED" if not any(c["code"] == "LAND_USE_MISMATCH" for c in conflicts) else "CONFLICT"
        }
    }
    
    return {
        "parcel_id": parcel["id"],
        "overall_status": status,
        "confidence_score": score,
        "conflicts": conflicts,
        "match_metrics": match_results,
        "spatial_metrics": spatial_results,
        "provenance": provenance
    }
