import os
import sys
import pandas as pd
import numpy as np

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.services.prediction_service import prediction_service

real_articles = [
    ('State universities expand need-based financial aid for low-income undergraduate students', 
     'Higher education administrators announced grants covering full tuition costs for qualified students whose family income falls below state median levels.'),
    ('Local school board approves new science curriculum and funding for laboratory equipment', 
     'The district board voted unanimously on Monday to modernize biology and chemistry lab facilities across five regional high schools.'),
    ('Tech giant unveils new open-source programming language for mobile app developers', 
     'Engineers introduced the language during an annual developer conference, highlighting improved memory management and cross-platform compilation.'),
    ('World Health Organization releases updated guidelines on physical activity and sedentary behavior', 
     'Health authorities recommend at least 150 minutes of moderate aerobic exercise weekly to reduce risks of cardiovascular disease and metabolic conditions.'),
    ('City transit agency extends subway service hours for weekend festival attendees', 
     'Commuters will have access to continuous train service on major routes to accommodate increased passenger volume during the downtown music festival.'),
    ('Researchers discover new deep-sea coral reef species off the coast of Australia', 
     'Marine biologists conducting underwater drone surveys documented vibrant coral ecosystems thriving at depths previously thought uninhabitable.'),
    ('Major retailer expands grocery delivery services to rural communities', 
     'The retail chain announced same-day delivery options for fresh produce and household essentials across twenty additional regional distribution hubs.'),
    ('Astronomy team captures unprecedented high-resolution images of solar flares', 
     'Solar physicists utilizing ground-based solar telescopes observed rapid magnetic reconnection events on the suns surface with unprecedented clarity.'),
    ('Nonprofit organization opens new community kitchen to combat local food insecurity', 
     'Volunteers and local business sponsors partnered to serve over five hundred hot meals daily to residents in underserved urban neighborhoods.'),
    ('Museum exhibits rare Renaissance manuscripts after extensive multi-year preservation effort', 
     'Curators displayed illuminated texts and historical correspondence dating back to the fifteenth century following delicate restoration work.'),
    ('National park service announces seasonal trail closures for wildlife habitat protection', 
     'Rangers temporarily closed several high-elevation hiking routes to protect nesting raptors and prevent erosion along fragile alpine terrain.'),
    ('University hospital opens specialized cardiac care center for pediatric patients', 
     'The medical facility features state-of-the-art diagnostic imaging suites and dedicated surgical teams for congenital heart defect treatment.'),
    ('City Marathon brings together 25000 runners from across the globe',
     'Athletes completed the 26.2 mile course through historic city districts with record-breaking finish times in the womens division.'),
    ('Public library system introduces free digital coding bootcamps for teenagers',
     'The initiative provides access to computers, mentorship, and software engineering workshops at twelve neighborhood library branches.'),
    ('Regional symphony orchestra performs Beethoven symphony in outdoor summer concert',
     'Thousands of community members attended the free open-air performance at the central park amphitheater on Saturday evening.')
]

print(f"Testing {len(real_articles)} genuine Real News articles against current Logistic Regression model:\n")
fps = []
for title, text in real_articles:
    res = prediction_service.predict(title, text)
    title_res = prediction_service.predict(title, '')
    content_res = prediction_service.predict('', text)
    
    print(f"Headline: {title}")
    print(f"  Title+Content -> Predicted: {res['prediction']} (Confidence: {res['confidence']:.2f}%)")
    print(f"  Title-only    -> Predicted: {title_res['prediction']} (Confidence: {title_res['confidence']:.2f}%)")
    print(f"  Content-only  -> Predicted: {content_res['prediction']} (Confidence: {content_res['confidence']:.2f}%)")
    print()
    if res['prediction'] == 'FAKE' or title_res['prediction'] == 'FAKE' or content_res['prediction'] == 'FAKE':
        fps.append({
            'title': title,
            'text': text,
            'combined_pred': res['prediction'],
            'combined_conf': res['confidence'],
            'title_pred': title_res['prediction'],
            'title_conf': title_res['confidence'],
            'content_pred': content_res['prediction'],
            'content_conf': content_res['confidence'],
        })

print(f"==================================================")
print(f"Summary of False Positives on Real News Test Set:")
print(f"Total articles tested: {len(real_articles)}")
print(f"Articles triggering FAKE in at least one mode: {len(fps)}")
for i, fp in enumerate(fps, 1):
    print(f"\n{i}. Actual Label: REAL")
    print(f"   Headline: {fp['title']}")
    print(f"   Title-only:    Predicted={fp['title_pred']} (Confidence={fp['title_conf']:.2f}%)")
    print(f"   Content-only:  Predicted={fp['content_pred']} (Confidence={fp['content_conf']:.2f}%)")
    print(f"   Title+Content: Predicted={fp['combined_pred']} (Confidence={fp['combined_conf']:.2f}%)")
