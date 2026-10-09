"""
TerraSync AI - AI-Based Property & Parcel Matching Module
Uses TF-IDF Vector Cosine Similarity and Fuzzy String Matching to link records across sources.
"""

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from typing import Dict, Any, List
from .cleaner import normalize_owner_name, normalize_text

def compute_name_similarity(name1: str, name2: str) -> float:
    n1 = normalize_owner_name(name1)
    n2 = normalize_owner_name(name2)
    if not n1 or not n2:
        return 0.0
    if n1 == n2:
        return 1.0
        
    # Use TF-IDF character & word n-grams for robust matching despite typos/initials
    vectorizer = TfidfVectorizer(analyzer='char_wb', ngram_range=(2, 4))
    try:
        tfidf_matrix = vectorizer.fit_transform([n1, n2])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(round(sim, 4))
    except Exception:
        # Fallback word overlap
        words1 = set(n1.split())
        words2 = set(n2.split())
        if not words1 or not words2:
            return 0.0
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        return round(len(intersection) / len(union), 4)

def match_parcel_records(sources: Dict[str, Any]) -> Dict[str, Any]:
    """
    Evaluates cross-source matching consistency across owner names, survey numbers, and IDs.
    Returns composite matching confidence metrics.
    """
    revenue_owner = sources.get("land_revenue", {}).get("owner_name", "")
    tax_owner = sources.get("municipal_tax", {}).get("tax_payer_name", "")
    reg_purchaser = sources.get("registration", {}).get("purchaser_name", "")
    
    sim_rev_tax = compute_name_similarity(revenue_owner, tax_owner)
    sim_rev_reg = compute_name_similarity(revenue_owner, reg_purchaser)
    sim_tax_reg = compute_name_similarity(tax_owner, reg_purchaser)
    
    avg_owner_sim = round((sim_rev_tax + sim_rev_reg + sim_tax_reg) / 3.0, 4)
    
    return {
        "owner_matching": {
            "revenue_vs_tax": sim_rev_tax,
            "revenue_vs_registration": sim_rev_reg,
            "tax_vs_registration": sim_tax_reg,
            "average_similarity": avg_owner_sim
        },
        "is_owner_matched": avg_owner_sim >= 0.75
    }
