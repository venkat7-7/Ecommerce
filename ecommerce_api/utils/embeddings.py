import os
import requests
from typing import List, Optional

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def get_embedding(text: str) -> Optional[List[float]]:
    """
    Generates a 768-dimensional float embedding using Google Gemini's text-embedding-004 model.
    """
    if not GEMINI_API_KEY:
        print("Warning: GEMINI_API_KEY environment variable is not set. Skipping embedding generation.")
        return None

    url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "model": "models/text-embedding-004",
        "content": {
            "parts": [{"text": text}]
        }
    }

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=10)
        if response.status_code == 200:
            res_json = response.json()
            if "embedding" in res_json and "values" in res_json["embedding"]:
                return res_json["embedding"]["values"]
        print(f"Warning: Gemini Embedding API returned status {response.status_code}: {response.text}")
    except Exception as e:
        print(f"Warning: Failed to fetch embedding from Gemini API: {e}")
    return None

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    """
    Computes the cosine similarity between two float vectors.
    """
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    
    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_a = sum(a * a for a in v1) ** 0.5
    norm_b = sum(b * b for b in v2) ** 0.5
    
    if norm_a == 0.0 or norm_b == 0.0:
        return 0.0
        
    return dot_product / (norm_a * norm_b)


