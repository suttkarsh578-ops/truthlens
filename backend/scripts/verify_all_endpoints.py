import os
import urllib.request
import urllib.parse
import json
import time
from dotenv import load_dotenv

load_dotenv()
BASE_URL = os.getenv("API_BASE_URL") or os.getenv("VITE_API_BASE_URL") or "http://127.0.0.1:8000/api"

endpoints = [
    ("GET", f"{BASE_URL}/health", None),
    ("POST", f"{BASE_URL}/predict", {
        "headline": "Federal Reserve Holds Interest Rates Steady Amid Cooling Inflation Indicators",
        "content": "WASHINGTON (Reuters) - The Federal Reserve held interest rates steady on Wednesday as inflation moderated."
    }),
    ("GET", f"{BASE_URL}/history", None),
    ("GET", f"{BASE_URL}/dashboard", None),
    ("GET", f"{BASE_URL}/model/metrics", None),
    ("GET", f"{BASE_URL}/model/info", None),
    ("GET", f"{BASE_URL}/dataset/stats", None),
    ("GET", f"{BASE_URL}/live-news", None)
]

print("=" * 70)
print("TESTING ALL TRUTHLENS API ENDPOINTS")
print("=" * 70)

prediction_id = None

for method, url, payload in endpoints:
    try:
        data = None
        headers = {"Content-Type": "application/json"}
        if payload is not None:
            data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers=headers, method=method)
        with urllib.request.urlopen(req, timeout=5) as res:
            body = res.read().decode('utf-8')
            json_body = json.loads(body)
            endpoint_name = url.replace("http://127.0.0.1:8000", "")
            print(f"[OK 200] {method} {endpoint_name}")
            if "predict" in url and "prediction" in json_body:
                print(f"       Result: {json_body['prediction']} | Confidence: {json_body['confidence']}% | Model: {json_body['model_name']}")
                print(f"       Text Stats: {json_body.get('text_statistics')}")
            elif "dataset/stats" in url:
                print(f"       Stats: Total={json_body.get('total')}, Real={json_body.get('real_count')}, Fake={json_body.get('fake_count')}, Sources={json_body.get('source_distribution')}")
            elif "model/metrics" in url:
                print(f"       Metrics Count: {len(json_body)} records")
            elif "history" in url and "items" in json_body and json_body["items"]:
                prediction_id = json_body["items"][0]["id"]
                print(f"       History Total: {json_body['total']} records (latest id: {prediction_id})")
            elif "dashboard" in url:
                print(f"       Dashboard: {json_body.get('stats')}")
    except Exception as e:
        print(f"[ERROR] {method} {url}: {e}")

if prediction_id:
    hist_id_url = f"{BASE_URL}/history/{prediction_id}"
    try:
        req = urllib.request.Request(hist_id_url, method="GET")
        with urllib.request.urlopen(req, timeout=5) as res:
            body = json.loads(res.read().decode('utf-8'))
            print(f"[OK 200] GET /api/history/{prediction_id}")
            print(f"       Item: {body['prediction']} | Headline: {body['headline'][:30]}...")
    except Exception as e:
        print(f"[ERROR] GET /api/history/{prediction_id}: {e}")

print("=" * 70)
