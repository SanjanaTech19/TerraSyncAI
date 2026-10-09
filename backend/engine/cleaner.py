"""
TerraSync AI - Data Cleaning & Standardization Module
Converts spatial units, standardizes owner names, Khata/Survey numbers, and CRS projections.
"""

import re
from typing import Dict, Any, Union

SQFT_TO_SQM = 0.092903
ACRE_TO_SQM = 4046.86
GUNTHA_TO_SQM = 101.17

def normalize_text(text: str) -> str:
    if not text:
        return ""
    # Lowercase, remove excess whitespace, replace punctuation except alphanumeric
    cleaned = text.lower().strip()
    cleaned = re.sub(r'[^\w\s]', ' ', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned)
    return cleaned

def normalize_owner_name(name: str) -> str:
    if not name:
        return ""
    # Strip common titles
    titles = ["mr", "mrs", "dr", "late", "shri", "smt", "messrs", "m/s", "llp", "pvt", "ltd"]
    cleaned = name.lower()
    for title in titles:
        cleaned = re.sub(r'\b' + title + r'\.?', '', cleaned)
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned.title()

def parse_and_convert_area_to_sqm(val: Union[str, float, int]) -> float:
    if isinstance(val, (int, float)):
        return float(val)
    if not val:
        return 0.0
    
    val_str = str(val).lower()
    
    # Check for sq ft / sq.ft / sqft
    if "sq" in val_str and "ft" in val_str:
        num = re.findall(r"[-+]?\d*\.\d+|\d+", val_str.replace(",", ""))
        if num:
            return round(float(num[0]) * SQFT_TO_SQM, 2)
            
    # Check for acres
    if "acre" in val_str:
        num = re.findall(r"[-+]?\d*\.\d+|\d+", val_str.replace(",", ""))
        if num:
            return round(float(num[0]) * ACRE_TO_SQM, 2)
            
    # Check for guntha
    if "guntha" in val_str:
        num = re.findall(r"[-+]?\d*\.\d+|\d+", val_str.replace(",", ""))
        if num:
            return round(float(num[0]) * GUNTHA_TO_SQM, 2)

    # Standard number search
    num = re.findall(r"[-+]?\d*\.\d+|\d+", val_str.replace(",", ""))
    if num:
        return float(num[0])
        
    return 0.0

def normalize_survey_number(survey_no: str) -> str:
    if not survey_no:
        return ""
    cleaned = survey_no.upper().replace("SY", "").replace("NO", "").replace(".", "").strip()
    return cleaned
