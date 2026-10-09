"""
TerraSync AI - FastAPI Application Server
Entry point for multi-source urban land data harmonization API.
"""

from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import copy

from mock_data import get_all_parcels, get_parcel_by_id
from engine.matcher import match_parcel_records
from engine.spatial_analyzer import analyze_spatial_parcel
from engine.conflict_detector import detect_conflicts
from engine.harmonizer import harmonize_property
from engine.llm_explainability import generate_llm_explanation

app = FastAPI(
    title="TerraSync AI Platform API",
    description="Intelligent GIS Multi-Source Urban Land Harmonization Engine",
    version="1.0.0"
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for verified state overrides
VERIFIED_PARCELS_DB: Dict[str, Dict[str, Any]] = {}

class VerificationPayload(BaseModel):
    verified_by: str
    official_designation: str
    approved_owner_name: str
    approved_area_sqm: float
    approved_land_use: str
    resolution_notes: str
    action: str  # "APPROVE", "FLAG_SURVEY", "REJECT"

def process_parcel_pipeline(parcel: Dict[str, Any]) -> Dict[str, Any]:
    # Check if custom override exists
    pid = parcel["id"]
    if pid in VERIFIED_PARCELS_DB:
        override = VERIFIED_PARCELS_DB[pid]
        p_copy = copy.deepcopy(parcel)
        p_copy["overall_status"] = "Verified & Approved" if override["action"] == "APPROVE" else "Pending Field Survey"
        p_copy["confidence_score"] = 99.0 if override["action"] == "APPROVE" else p_copy["confidence_score"]
        p_copy["primary_owner"] = override["approved_owner_name"]
        p_copy["harmonized_area_sqm"] = override["approved_area_sqm"]
        p_copy["harmonized_land_use"] = override["approved_land_use"]
        p_copy["verification_audit"] = override
        
        match_res = match_parcel_records(p_copy)
        spatial_res = analyze_spatial_parcel(p_copy.get("cadastral", {}), p_copy.get("gis_dataset", {}), p_copy.get("satellite", {}))
        conflicts = detect_conflicts(p_copy, match_res, spatial_res)
        harm_res = harmonize_property(p_copy, match_res, spatial_res, conflicts)
        harm_res["overall_status"] = p_copy["overall_status"]
        harm_res["confidence_score"] = p_copy["confidence_score"]
        llm_res = generate_llm_explanation(p_copy, conflicts, harm_res)
        
        return {
            "parcel": p_copy,
            "harmonization": harm_res,
            "llm_explanation": llm_res,
            "is_human_verified": True
        }

    match_res = match_parcel_records(parcel)
    spatial_res = analyze_spatial_parcel(parcel.get("cadastral", {}), parcel.get("gis_dataset", {}), parcel.get("satellite", {}))
    conflicts = detect_conflicts(parcel, match_res, spatial_res)
    harm_res = harmonize_property(parcel, match_res, spatial_res, conflicts)
    llm_res = generate_llm_explanation(parcel, conflicts, harm_res)
    
    return {
        "parcel": parcel,
        "harmonization": harm_res,
        "llm_explanation": llm_res,
        "is_human_verified": False
    }

@app.get("/api/health")
def health_check():
    return {"status": "online", "system": "TerraSync AI GIS Engine v1.0.0"}

@app.get("/api/parcels")
def list_parcels():
    all_raw = get_all_parcels()
    results = []
    for raw in all_raw:
        processed = process_parcel_pipeline(raw)
        results.append({
            "id": raw["id"],
            "title": raw["title"],
            "locality": raw["locality"],
            "city": raw["city"],
            "overall_status": processed["harmonization"]["overall_status"],
            "confidence_score": processed["harmonization"]["confidence_score"],
            "primary_owner": processed["parcel"]["primary_owner"],
            "harmonized_area_sqm": processed["parcel"]["harmonized_area_sqm"],
            "harmonized_land_use": processed["parcel"]["harmonized_land_use"],
            "conflict_count": len(processed["harmonization"]["conflicts"]),
            "center_lat": raw["center_lat"],
            "center_lng": raw["center_lng"],
            "is_human_verified": processed["is_human_verified"]
        })
    return {"parcels": results, "total": len(results)}

@app.get("/api/parcels/{parcel_id}")
def get_parcel_detail(parcel_id: str):
    raw = get_parcel_by_id(parcel_id)
    if not raw:
        raise HTTPException(status_code=404, detail="Parcel record not found")
    processed = process_parcel_pipeline(raw)
    return processed

@app.post("/api/parcels/{parcel_id}/verify")
def verify_parcel(parcel_id: str, payload: VerificationPayload):
    raw = get_parcel_by_id(parcel_id)
    if not raw:
        raise HTTPException(status_code=404, detail="Parcel record not found")
        
    VERIFIED_PARCELS_DB[raw["id"]] = payload.dict()
    processed = process_parcel_pipeline(raw)
    return {
        "message": f"Parcel {parcel_id} successfully verified and saved to authoritative ledger.",
        "result": processed
    }

@app.get("/api/analytics")
def get_analytics():
    all_raw = get_all_parcels()
    processed_list = [process_parcel_pipeline(p) for p in all_raw]
    
    total = len(processed_list)
    harmonized_count = sum(1 for p in processed_list if p["harmonization"]["overall_status"] == "Harmonized")
    flagged_count = sum(1 for p in processed_list if p["harmonization"]["overall_status"] == "Discrepancy Flagged")
    critical_count = sum(1 for p in processed_list if p["harmonization"]["overall_status"] == "Critical Conflict")
    verified_count = sum(1 for p in processed_list if p["is_human_verified"])
    
    avg_confidence = round(sum(p["harmonization"]["confidence_score"] for p in processed_list) / total, 1)
    
    conflict_distribution = {
        "AREA_MISMATCH": 0,
        "OWNER_MISMATCH": 0,
        "SATELLITE_ENCROACHMENT": 0,
        "LAND_USE_MISMATCH": 0,
        "LEGAL_ENCUMBRANCE": 0
    }
    
    for p in processed_list:
        for c in p["harmonization"]["conflicts"]:
            code = c.get("code")
            if code in conflict_distribution:
                conflict_distribution[code] += 1
                
    return {
        "total_properties": total,
        "harmonized_count": harmonized_count,
        "discrepancy_flagged_count": flagged_count,
        "critical_conflict_count": critical_count,
        "human_verified_count": verified_count,
        "average_confidence_score": avg_confidence,
        "conflict_distribution": conflict_distribution,
        "sources_connected": 6
    }

@app.post("/api/ingest")
def ingest_files(file: Optional[UploadFile] = File(None)):
    return {
        "status": "success",
        "message": f"Successfully ingested multi-source file: {file.filename if file else 'Simulated Urban Dataset Batch'}",
        "records_processed": 14,
        "harmonized_automatically": 11,
        "flagged_for_review": 3
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
