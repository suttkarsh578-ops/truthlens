import os
import urllib.request
import json
from dotenv import load_dotenv

load_dotenv()
api_base = os.getenv("API_BASE_URL") or os.getenv("VITE_API_BASE_URL") or "http://127.0.0.1:8000/api"

try:
    res = urllib.request.urlopen(f"{api_base}/live-news?limit=100")
    data = json.loads(res.read().decode("utf-8"))
    print("API Status:", data.get("status"))
    print("Source:", data.get("source"))
    print("Total Live Articles:", len(data.get("articles", [])))
    print("\n--- SAMPLE BREAKING HEADLINES ---")
    for idx, art in enumerate(data.get("articles", [])[:6], 1):
        print(f"{idx}. [{art.get('category', 'general').upper()}] {art.get('title')}")
        print(f"   Published: {art.get('published_at')} | Source: {art.get('source_name')}")
except Exception as e:
    print("Error querying live news:", e)
