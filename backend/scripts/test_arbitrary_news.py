import sys
import os

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from app.services.prediction_service import prediction_service

test_inputs = [
    # Real news
    ("India and France sign defense cooperation treaty in New Delhi", "Officials from both ministries confirmed the bilateral agreement on maritime security."),
    ("Stock markets rise after inflation data matches analysts expectations", "Wall Street indices gained 1.2 percent following the release of consumer price index figures by the labor department."),
    ("Researchers at Stanford University publish new battery chemistry study", "The peer-reviewed paper in Nature Energy demonstrates 3000 charge cycles for sodium ion cells."),
    ("Prime Minister addresses parliament on annual economic budget proposals", "The government outlined fiscal allocations for healthcare, education, and rural development."),
    ("NASA launches robotic lander to explore Jupiter icy moon Europa", "The mission will analyze subsurface ocean plumes for signs of organic molecules and biosignatures."),
    
    # Fake / sensational
    ("SHOCKING: Eating raw garlic cured stage 4 cancer in 2 days doctors stunned", "Secret natural cure hidden by big pharma revealed in leaked video watch before it is deleted."),
    ("Government puts mind control chips inside tap water to control population", "Whistleblower reveals classified deep state project to turn citizens into obedient slaves."),
    ("Aliens build secret pyramid base underneath New York City subway", "Mysterious green glowing portal discovered by construction workers covered up by FBI."),
    ("BREAKING: Drinking bleach permanently eliminates all viral infections overnight", "Miracle solution discovered by anonymous online healer destroys all toxins in hours."),
    ("Secret law passed banning all banks and giving every citizen free million dollars", "Leaked presidential decree orders treasury to print infinite money for everyone.")
]

print("=" * 75)
print("EVALUATING MODEL ON 10 ARBITRARY USER INPUTS")
print("=" * 75)

for h, c in test_inputs:
    res = prediction_service.predict(h, c)
    print(f"Headline: {h[:55]}...")
    print(f"-> Predicted: [{res['prediction']}] | Confidence: {res['confidence']}% | Model: {res['model_name']}\n")
