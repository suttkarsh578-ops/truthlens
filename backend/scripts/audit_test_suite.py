import os
import sys
import pandas as pd
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.services.prediction_service import prediction_service
from app.main import app

def run_tests():
    print("==================================================")
    print("RUNNING DIRECT MODEL PREDICTION TESTS (ITEM 8)")
    print("==================================================")
    
    fake_df = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', 'data', 'raw', 'Fake.csv'))
    true_df = pd.read_csv(os.path.join(os.path.dirname(__file__), '..', 'data', 'raw', 'True.csv'))

    ex_real_title = true_df.iloc[0]['title']
    ex_real_text = str(true_df.iloc[0]['text'])[:300]

    ex_fake_title = fake_df.iloc[0]['title']
    ex_fake_text = str(fake_df.iloc[0]['text'])[:300]

    manual_fake_title = 'BREAKING: Secret Alien Technology Discovered In Deep Underground Vault By Secret Agents'
    manual_fake_text = 'Shocking leaked documents reveal incredible truth that government has been hiding flying saucers and cloned alien specimens in secret bases.'

    manual_real_title = 'Federal Reserve signals possible interest rate adjustments amid steady inflation data'
    manual_real_text = 'Central bank officials announced on Wednesday that monetary policy will remain responsive to economic indicators and labor market trends in the coming quarter.'

    tests = [
        ('A. Known REAL Dataset Example', ex_real_title, ex_real_text, 'REAL'),
        ('B. Known FAKE Dataset Example', ex_fake_title, ex_fake_text, 'FAKE'),
        ('C. Manually Written Fake Example', manual_fake_title, manual_fake_text, 'FAKE'),
        ('D. Manually Written Real-style Example', manual_real_title, manual_real_text, 'REAL'),
    ]

    for name, title, text, expected in tests:
        res = prediction_service.predict(title, text)
        pred = res['prediction']
        conf = res['confidence']
        model = res['model_name']
        print(f"=== {name} ===")
        print(f"Input Title: {title}")
        print(f"Expected class: {expected}")
        print(f"Predicted class: {pred}")
        print(f"Confidence: {conf:.2f}%")
        print(f"Model: {model}")
        if 'multi_model_analysis' in res and isinstance(res['multi_model_analysis'], list):
            model_preds = [f"{m['name']}: {m['prediction']} ({m['confidence']:.1f}%)" for m in res['multi_model_analysis']]
            print(f"Multi-model breakdown: {', '.join(model_preds)}")
        print()

    print("==================================================")
    print("RUNNING API END-TO-END PREDICTION TEST (ITEM 9)")
    print("==================================================")
    
    client = TestClient(app)
    payload = {
        "headline": "Economic forum convenes global leaders to address inflation and international trade",
        "content": "Leaders from over 50 nations gathered to discuss supply chain stabilization, renewable energy investment, and sustainable fiscal growth policies."
    }
    
    response = client.post("/api/predict", json=payload)
    print(f"POST /api/predict status code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print("API Response received:")
        print(f"  Prediction: {data.get('prediction')}")
        print(f"  Confidence: {data.get('confidence')}%")
        print(f"  Model Name: {data.get('model_name')}")
        print(f"  Processing Time: {data.get('processing_time_ms')}ms")
        print(f"  Word Count: {data.get('word_count')}")
        print(f"  Character Count: {data.get('char_count')}")
        print(f"  Multi-model analysis included: {bool(data.get('multi_model_analysis'))}")
        print(f"  Top keywords included: {bool(data.get('top_keywords'))}")
        print(f"  Credibility indicators included: {bool(data.get('credibility_indicators'))}")
    else:
        print(f"API Request failed: {response.text}")

if __name__ == '__main__':
    run_tests()
