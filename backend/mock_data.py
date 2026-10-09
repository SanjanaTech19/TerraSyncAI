"""
TerraSync AI - Mock Multi-Source Urban Land Data
Contains realistic multi-source records for 8 urban properties across six disparate sources:
1. Land Revenue Records (CSV/DB)
2. Cadastral Map Survey (GeoJSON Polygons)
3. Municipal Property Tax Database (JSON)
4. Registration Records (Deeds/PDF OCR)
5. GIS Datasets (Shapefile/GeoJSON)
6. Satellite Imagery Analytics (Spatial & Footprint AI)
"""

from typing import Dict, Any, List

SAMPLE_PARCELS: List[Dict[str, Any]] = [
    {
        "id": "PARCEL-101",
        "title": "Plot 42, 100ft Road, Indiranagar, Bengaluru",
        "locality": "Indiranagar Stage 2",
        "city": "Bengaluru",
        "state": "Karnataka",
        "overall_status": "Discrepancy Flagged",
        "confidence_score": 78.5,
        "primary_owner": "Rajesh Kumar Sharma",
        "harmonized_area_sqm": 1180.0,
        "harmonized_land_use": "Commercial/Mixed",
        "center_lat": 12.9784,
        "center_lng": 77.6408,
        
        # Source 1: Land Revenue Dept (CSV / DB)
        "land_revenue": {
            "source_name": "Land Revenue Records (Bhoomi DB)",
            "source_type": "CSV / Database",
            "last_updated": "2021-04-12",
            "khata_no": "K-8849/2021",
            "survey_no": "Sy. No. 42/1A",
            "owner_name": "Rajesh Kumar Sharma",
            "co_owners": ["Sunita Sharma"],
            "registered_area_sqm": 1250.0,
            "area_unit_original": "13,454 sq.ft (1,250 sq.m)",
            "land_classification": "Converted Residential",
            "annual_revenue_inr": 24500,
            "encumbrance": "Mortgaged to HDFC Bank (2019)"
        },

        # Source 2: Cadastral Survey Map (GeoJSON Polygons)
        "cadastral": {
            "source_name": "Cadastral Survey Map (SSLR Dept)",
            "source_type": "GeoJSON / Vector Map",
            "last_updated": "2022-11-05",
            "crs": "EPSG:4326",
            "cadastral_id": "CAD-IND-42-1A",
            "measured_area_sqm": 1185.4,
            "perimeter_meters": 138.2,
            "boundary_confidence": 0.92,
            "coordinates": [
                [77.6402, 12.9788],
                [77.6414, 12.9788],
                [77.6414, 12.9780],
                [77.6402, 12.9780],
                [77.6402, 12.9788]
            ],
            "surrounding_parcels": ["CAD-IND-42-1B", "CAD-IND-43"]
        },

        # Source 3: Municipal Property Tax DB (JSON)
        "municipal_tax": {
            "source_name": "BBMP Property Tax Database",
            "source_type": "REST API / JSON",
            "last_updated": "2024-03-10",
            "pid": "100-W0042-88",
            "tax_payer_name": "Rajesh K. Sharma",
            "built_up_area_sqm": 920.0,
            "plot_size_sqm": 1200.0,
            "zone": "Commercial Category A",
            "land_use_tax": "Commercial Retail",
            "tax_status": "Paid (Up to FY 2024-25)",
            "annual_tax_inr": 184000
        },

        # Source 4: Registration Records (Deed / OCR PDF)
        "registration": {
            "source_name": "Sub-Registrar Deed Registry",
            "source_type": "PDF OCR Extracted",
            "last_updated": "2018-09-24",
            "deed_number": "IND-1-08943-2018",
            "deed_type": "Sale Deed",
            "purchaser_name": "Rajesh Kumar Sharma & Sunita Sharma",
            "seller_name": "Venkatesh Murthy",
            "conveyed_extent_sqm": 1250.0,
            "conveyance_value_inr": 45000000,
            "stamp_duty_paid": 2925000,
            "ocr_confidence": 0.96
        },

        # Source 5: GIS Layer Dataset (Shapefile)
        "gis_dataset": {
            "source_name": "Urban Planning GIS Master Plan",
            "source_type": "Spatial Shapefile",
            "last_updated": "2023-08-15",
            "gis_uuid": "GIS-BLR-IND-9942",
            "crs": "EPSG:3857 (Reprojected to WGS84)",
            "computed_area_sqm": 1180.0,
            "zoning_classification": "Commercial Mixed Use (C-2)",
            "road_width_frontage_m": 30.0,
            "setback_compliance": "Non-compliant east margin"
        },

        # Source 6: Satellite Imagery Analytics (Raster & Footprint AI)
        "satellite": {
            "source_name": "High-Res Planet / Sentinel AI Footprint",
            "source_type": "Raster AI Segmentation",
            "last_updated": "2025-01-20",
            "satellite_ref": "SAT-IMG-202501-BLR04",
            "detected_building_footprint_sqm": 945.0,
            "open_plot_area_sqm": 225.0,
            "total_physical_parcel_sqm": 1170.0,
            "vegetation_cover_pct": 8.2,
            "encroachment_flag": True,
            "encroachment_details": "Minor physical encroachment of 15.4 sqm onto east drainage buffer."
        }
    },
    {
        "id": "PARCEL-102",
        "title": "Site No. 18, 5th Block Koramangala, Bengaluru",
        "locality": "Koramangala 5th Block",
        "city": "Bengaluru",
        "state": "Karnataka",
        "overall_status": "Harmonized",
        "confidence_score": 96.2,
        "primary_owner": "Ananya Tech Ventures Pvt Ltd",
        "harmonized_area_sqm": 800.0,
        "harmonized_land_use": "Commercial IT Office",
        "center_lat": 12.9345,
        "center_lng": 77.6242,
        
        "land_revenue": {
            "source_name": "Land Revenue Records (Bhoomi DB)",
            "source_type": "CSV / Database",
            "last_updated": "2023-01-10",
            "khata_no": "K-4421/2023",
            "survey_no": "Sy. No. 18/2",
            "owner_name": "Ananya Tech Ventures Pvt Ltd",
            "co_owners": [],
            "registered_area_sqm": 800.0,
            "area_unit_original": "8,611 sq.ft (800 sq.m)",
            "land_classification": "Converted Commercial",
            "annual_revenue_inr": 32000,
            "encumbrance": "Nil / Unencumbered"
        },
        "cadastral": {
            "source_name": "Cadastral Survey Map (SSLR Dept)",
            "source_type": "GeoJSON / Vector Map",
            "last_updated": "2023-05-18",
            "crs": "EPSG:4326",
            "cadastral_id": "CAD-KOR-18-2",
            "measured_area_sqm": 801.2,
            "perimeter_meters": 114.0,
            "boundary_confidence": 0.98,
            "coordinates": [
                [77.6238, 12.9348],
                [77.6246, 12.9348],
                [77.6246, 12.9342],
                [77.6238, 12.9342],
                [77.6238, 12.9348]
            ],
            "surrounding_parcels": ["CAD-KOR-18-1", "CAD-KOR-19"]
        },
        "municipal_tax": {
            "source_name": "BBMP Property Tax Database",
            "source_type": "REST API / JSON",
            "last_updated": "2024-04-02",
            "pid": "108-K0018-92",
            "tax_payer_name": "Ananya Tech Ventures Pvt Ltd",
            "built_up_area_sqm": 2200.0,
            "plot_size_sqm": 800.0,
            "zone": "Commercial Category A",
            "land_use_tax": "IT Office Complex",
            "tax_status": "Paid (Up to FY 2024-25)",
            "annual_tax_inr": 340000
        },
        "registration": {
            "source_name": "Sub-Registrar Deed Registry",
            "source_type": "PDF OCR Extracted",
            "last_updated": "2022-12-15",
            "deed_number": "KOR-2-04411-2022",
            "deed_type": "Sale Deed",
            "purchaser_name": "Ananya Tech Ventures Pvt Ltd",
            "seller_name": "Global Infra Developers",
            "conveyed_extent_sqm": 800.0,
            "conveyance_value_inr": 85000000,
            "stamp_duty_paid": 5525000,
            "ocr_confidence": 0.99
        },
        "gis_dataset": {
            "source_name": "Urban Planning GIS Master Plan",
            "source_type": "Spatial Shapefile",
            "last_updated": "2023-09-01",
            "gis_uuid": "GIS-BLR-KOR-1802",
            "crs": "EPSG:4326",
            "computed_area_sqm": 800.0,
            "zoning_classification": "High Density Commercial",
            "road_width_frontage_m": 24.0,
            "setback_compliance": "Fully Compliant"
        },
        "satellite": {
            "source_name": "High-Res Planet / Sentinel AI Footprint",
            "source_type": "Raster AI Segmentation",
            "last_updated": "2025-02-01",
            "satellite_ref": "SAT-IMG-202502-BLR12",
            "detected_building_footprint_sqm": 620.0,
            "open_plot_area_sqm": 180.0,
            "total_physical_parcel_sqm": 800.0,
            "vegetation_cover_pct": 4.5,
            "encroachment_flag": False,
            "encroachment_details": "No encroachment detected."
        }
    },
    {
        "id": "PARCEL-103",
        "title": "Survey No 105/3, Whitefield Main Road, Bengaluru",
        "locality": "Whitefield",
        "city": "Bengaluru",
        "state": "Karnataka",
        "overall_status": "Critical Conflict",
        "confidence_score": 48.2,
        "primary_owner": "Conflicting: Ramesh Gowda vs Urban Infra Developers",
        "harmonized_area_sqm": 3400.0,
        "harmonized_land_use": "Disputed / Agricultural vs Commercial",
        "center_lat": 12.9698,
        "center_lng": 77.7499,
        
        "land_revenue": {
            "source_name": "Land Revenue Records (Bhoomi DB)",
            "source_type": "CSV / Database",
            "last_updated": "2016-08-11",
            "khata_no": "K-1092/2016",
            "survey_no": "Sy. No. 105/3",
            "owner_name": "Ramesh Gowda",
            "co_owners": ["Krishna Gowda"],
            "registered_area_sqm": 4046.0,
            "area_unit_original": "1.00 Acre (4,046 sq.m)",
            "land_classification": "Agricultural Dry Land",
            "annual_revenue_inr": 1200,
            "encumbrance": "Litigation Pending (OS 440/2021 Civil Court)"
        },
        "cadastral": {
            "source_name": "Cadastral Survey Map (SSLR Dept)",
            "source_type": "GeoJSON / Vector Map",
            "last_updated": "2019-02-14",
            "crs": "EPSG:4326",
            "cadastral_id": "CAD-WHF-105-3",
            "measured_area_sqm": 3350.0,
            "perimeter_meters": 260.0,
            "boundary_confidence": 0.74,
            "coordinates": [
                [77.7490, 12.9705],
                [77.7510, 12.9705],
                [77.7510, 12.9692],
                [77.7490, 12.9692],
                [77.7490, 12.9705]
            ],
            "surrounding_parcels": ["CAD-WHF-105-2", "CAD-WHF-106"]
        },
        "municipal_tax": {
            "source_name": "BBMP Property Tax Database",
            "source_type": "REST API / JSON",
            "last_updated": "2023-11-20",
            "pid": "112-W0105-33",
            "tax_payer_name": "Urban Infra Developers LLP",
            "built_up_area_sqm": 0.0,
            "plot_size_sqm": 3400.0,
            "zone": "Industrial & Warehousing",
            "land_use_tax": "Vacant Commercial Plot",
            "tax_status": "Default / Tax Arrears since 2021",
            "annual_tax_inr": 125000
        },
        "registration": {
            "source_name": "Sub-Registrar Deed Registry",
            "source_type": "PDF OCR Extracted",
            "last_updated": "2020-06-19",
            "deed_number": "WHF-4-02981-2020",
            "deed_type": "Joint Development Agreement (JDA)",
            "purchaser_name": "Urban Infra Developers LLP",
            "seller_name": "Ramesh Gowda",
            "conveyed_extent_sqm": 3400.0,
            "conveyance_value_inr": 120000000,
            "stamp_duty_paid": 7800000,
            "ocr_confidence": 0.88
        },
        "gis_dataset": {
            "source_name": "Urban Planning GIS Master Plan",
            "source_type": "Spatial Shapefile",
            "last_updated": "2022-04-10",
            "gis_uuid": "GIS-BLR-WHF-1053",
            "crs": "EPSG:3857",
            "computed_area_sqm": 3380.0,
            "zoning_classification": "Mutation Pending / Green Belt Conflict",
            "road_width_frontage_m": 18.0,
            "setback_compliance": "High Risk - Overlaps Metro Corridor Buffer"
        },
        "satellite": {
            "source_name": "High-Res Planet / Sentinel AI Footprint",
            "source_type": "Raster AI Segmentation",
            "last_updated": "2025-01-28",
            "satellite_ref": "SAT-IMG-202501-WHF09",
            "detected_building_footprint_sqm": 450.0,
            "open_plot_area_sqm": 2900.0,
            "total_physical_parcel_sqm": 3350.0,
            "vegetation_cover_pct": 34.0,
            "encroachment_flag": True,
            "encroachment_details": "Unauthorized tin shed construction & vehicle parking occupying 450 sqm."
        }
    },
    {
        "id": "PARCEL-104",
        "title": "Plot 12-B, Electronic City Phase 1, Bengaluru",
        "locality": "Electronic City",
        "city": "Bengaluru",
        "state": "Karnataka",
        "overall_status": "Harmonized",
        "confidence_score": 93.8,
        "primary_owner": "Bosch Cyberpark Pvt Ltd",
        "harmonized_area_sqm": 5000.0,
        "harmonized_land_use": "Industrial Tech Campus",
        "center_lat": 12.8452,
        "center_lng": 77.6602,
        
        "land_revenue": {
            "source_name": "Land Revenue Records (Bhoomi DB)",
            "source_type": "CSV / Database",
            "last_updated": "2022-07-22",
            "khata_no": "K-EC-12B/2022",
            "survey_no": "Sy. No. 55/1",
            "owner_name": "Bosch Cyberpark Pvt Ltd",
            "co_owners": [],
            "registered_area_sqm": 5000.0,
            "area_unit_original": "5,000 sq.m",
            "land_classification": "Industrial Estate KIADB",
            "annual_revenue_inr": 75000,
            "encumbrance": "Nil"
        },
        "cadastral": {
            "source_name": "Cadastral Survey Map (SSLR Dept)",
            "source_type": "GeoJSON / Vector Map",
            "last_updated": "2022-08-10",
            "crs": "EPSG:4326",
            "cadastral_id": "CAD-EC1-12B",
            "measured_area_sqm": 5005.0,
            "perimeter_meters": 285.0,
            "boundary_confidence": 0.97,
            "coordinates": [
                [77.6592, 12.8458],
                [77.6612, 12.8458],
                [77.6612, 12.8446],
                [77.6592, 12.8446],
                [77.6592, 12.8458]
            ],
            "surrounding_parcels": ["CAD-EC1-12A", "CAD-EC1-13"]
        },
        "municipal_tax": {
            "source_name": "ELCITA Industrial Municipality",
            "source_type": "REST API / JSON",
            "last_updated": "2024-05-15",
            "pid": "EC-IND-12B-01",
            "tax_payer_name": "Bosch Cyberpark Pvt Ltd",
            "built_up_area_sqm": 14200.0,
            "plot_size_sqm": 5000.0,
            "zone": "Industrial Park Zone 1",
            "land_use_tax": "R&D Software Facility",
            "tax_status": "Paid (Up to FY 2024-25)",
            "annual_tax_inr": 890000
        },
        "registration": {
            "source_name": "Sub-Registrar Deed Registry",
            "source_type": "PDF OCR Extracted",
            "last_updated": "2021-11-30",
            "deed_number": "ECI-1-01142-2021",
            "deed_type": "KIADB Lease-cum-Sale",
            "purchaser_name": "Bosch Cyberpark Pvt Ltd",
            "seller_name": "KIADB Industrial Development Board",
            "conveyed_extent_sqm": 5000.0,
            "conveyance_value_inr": 210000000,
            "stamp_duty_paid": 13650000,
            "ocr_confidence": 0.98
        },
        "gis_dataset": {
            "source_name": "Urban Planning GIS Master Plan",
            "source_type": "Spatial Shapefile",
            "last_updated": "2023-12-01",
            "gis_uuid": "GIS-BLR-EC-12B",
            "crs": "EPSG:4326",
            "computed_area_sqm": 5000.0,
            "zoning_classification": "Industrial Hi-Tech (I-3)",
            "road_width_frontage_m": 45.0,
            "setback_compliance": "Fully Compliant"
        },
        "satellite": {
            "source_name": "High-Res Planet / Sentinel AI Footprint",
            "source_type": "Raster AI Segmentation",
            "last_updated": "2025-02-10",
            "satellite_ref": "SAT-IMG-202502-EC01",
            "detected_building_footprint_sqm": 3100.0,
            "open_plot_area_sqm": 1900.0,
            "total_physical_parcel_sqm": 5000.0,
            "vegetation_cover_pct": 14.5,
            "encroachment_flag": False,
            "encroachment_details": "No physical boundary anomaly detected."
        }
    },
    {
        "id": "PARCEL-105",
        "title": "Property No. 74, MG Road / Brigade Road Junction, Bengaluru",
        "locality": "CBD / MG Road",
        "city": "Bengaluru",
        "state": "Karnataka",
        "overall_status": "Discrepancy Flagged",
        "confidence_score": 71.4,
        "primary_owner": "Venkataraman Brothers Trust",
        "harmonized_area_sqm": 1650.0,
        "harmonized_land_use": "Commercial Heritage / Retail",
        "center_lat": 12.9753,
        "center_lng": 77.6083,
        
        "land_revenue": {
            "source_name": "Land Revenue Records (Bhoomi DB)",
            "source_type": "CSV / Database",
            "last_updated": "2012-03-15",
            "khata_no": "K-CBD-0074",
            "survey_no": "Sy. No. 74 Old Cantonment",
            "owner_name": "Venkataraman Brothers Trust",
            "co_owners": ["K. Venkataraman", "S. Venkataraman"],
            "registered_area_sqm": 1820.0,
            "area_unit_original": "19,590 sq.ft (1,820 sq.m)",
            "land_classification": "Freehold Commercial",
            "annual_revenue_inr": 48000,
            "encumbrance": "Heritage Precinct Restriction"
        },
        "cadastral": {
            "source_name": "Cadastral Survey Map (SSLR Dept)",
            "source_type": "GeoJSON / Vector Map",
            "last_updated": "2020-10-18",
            "crs": "EPSG:4326",
            "cadastral_id": "CAD-CBD-74",
            "measured_area_sqm": 1645.0,
            "perimeter_meters": 162.0,
            "boundary_confidence": 0.86,
            "coordinates": [
                [77.6078, 12.9758],
                [77.6088, 12.9758],
                [77.6088, 12.9748],
                [77.6078, 12.9748],
                [77.6078, 12.9758]
            ],
            "surrounding_parcels": ["CAD-CBD-73", "CAD-CBD-75"]
        },
        "municipal_tax": {
            "source_name": "BBMP Property Tax Database",
            "source_type": "REST API / JSON",
            "last_updated": "2024-02-11",
            "pid": "101-M0074-00",
            "tax_payer_name": "Venkataraman Bros Trust",
            "built_up_area_sqm": 2400.0,
            "plot_size_sqm": 1650.0,
            "zone": "Commercial Heritage Zone",
            "land_use_tax": "Retail Shopping Complex",
            "tax_status": "Paid (Up to FY 2024-25)",
            "annual_tax_inr": 520000
        },
        "registration": {
            "source_name": "Sub-Registrar Deed Registry",
            "source_type": "PDF OCR Extracted",
            "last_updated": "2005-01-20",
            "deed_number": "CBD-1-00129-2005",
            "deed_type": "Trust Settlement Deed",
            "purchaser_name": "Venkataraman Brothers Trust",
            "seller_name": "Late Dr. T. Venkataraman",
            "conveyed_extent_sqm": 1820.0,
            "conveyance_value_inr": 35000000,
            "stamp_duty_paid": 2275000,
            "ocr_confidence": 0.82
        },
        "gis_dataset": {
            "source_name": "Urban Planning GIS Master Plan",
            "source_type": "Spatial Shapefile",
            "last_updated": "2023-05-19",
            "gis_uuid": "GIS-BLR-CBD-074",
            "crs": "EPSG:3857",
            "computed_area_sqm": 1640.0,
            "zoning_classification": "Heritage Commercial Precinct",
            "road_width_frontage_m": 36.0,
            "setback_compliance": "Road widening setback reservation of 170 sqm"
        },
        "satellite": {
            "source_name": "High-Res Planet / Sentinel AI Footprint",
            "source_type": "Raster AI Segmentation",
            "last_updated": "2025-01-15",
            "satellite_ref": "SAT-IMG-202501-CBD02",
            "detected_building_footprint_sqm": 1420.0,
            "open_plot_area_sqm": 230.0,
            "total_physical_parcel_sqm": 1650.0,
            "vegetation_cover_pct": 2.1,
            "encroachment_flag": True,
            "encroachment_details": "Road widening setback of 170 sqm occupied by municipal footpath infrastructure."
        }
    }
]

def get_all_parcels() -> List[Dict[str, Any]]:
    return SAMPLE_PARCELS

def get_parcel_by_id(parcel_id: str) -> Dict[str, Any]:
    for p in SAMPLE_PARCELS:
        if p["id"].lower() == parcel_id.lower():
            return p
    return None
