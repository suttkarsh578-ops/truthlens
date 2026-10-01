import sys
import os

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from app.services.prediction_service import prediction_service
from app.database.session import SessionLocal
from app.models.prediction import Prediction

test_cases = [
    ("A. Short headline + content", "Federal Reserve Holds Interest Rates Steady", "WASHINGTON (Reuters) - The Federal Reserve held interest rates steady today."),
    ("B. Long article", "Scientists Confirm Renewable Energy Grid Milestone", "International laboratories have published peer-reviewed findings on renewable power grids operating at 99% reliability across European transmission zones, validating multi-year investments in clean solar and offshore wind infrastructure."),
    ("C. Fake News Claim", "SHOCKING SECRET: Ancient Alien Base Unearthed", "Underground whistleblowers reveal secret alien spacecraft emitting telepathic signals under Antarctic glacier ice."),
    ("D. Empty headline", "", "European energy ministers finalized a cross-border power transmission agreement in Brussels to link offshore wind parks."),
    ("E. Empty content", "LEAKED PROOF: Secret Society Replaces World Leaders With Robotic Synthetic Clones", ""),
    ("F. Special characters", "***BREAKING NEWS!!!*** $$100 TRILLION PIRATE GOLD FOUND??? @@@", "Treasure hunters #discover secret pirate gold vault under Niagara Falls! & 100% real!!"),
    ("G. URL-containing text", "Check this breaking news https://news.example.com/breaking-alert", "Full story available at https://reuters.com/world/economy-report-2026 for further review.")
]

db = SessionLocal()
print("=" * 70)
print("TESTING PREDICTION SERVICE WITH REAL INPUTS")
print("=" * 70)

for name, h, c in test_cases:
    res = prediction_service.predict(h, c)
    print(f"Test [{name}]:")
    print(f"  Prediction: {res['prediction']}, Confidence: {res['confidence']}%, Time: {res['processing_time_ms']}ms")
    print(f"  Model: {res['model_name']}, Version: {res['model_version']}")
    print(f"  Stats: {res['text_statistics']}\n")

    # Test DB insertion
    db_p = Prediction(
        headline=h,
        content=c,
        prediction=res['prediction'],
        confidence=res['confidence'],
        model_name=res['model_name'],
        processing_time_ms=res['processing_time_ms']
    )
    db.add(db_p)
    db.commit()

recent_preds = db.query(Prediction).order_by(Prediction.created_at.desc()).limit(10).all()
print(f"Verified {len(recent_preds)} predictions saved in PostgreSQL table 'predictions':")
for p in recent_preds:
    hl = p.headline[:35] if p.headline else '(No Headline)'
    print(f"  ID: {p.id:<4} | {p.prediction:<5} ({p.confidence:>5.1f}%) | Headline: {hl}")

db.close()
