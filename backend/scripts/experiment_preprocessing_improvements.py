import os
import sys
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.services.nlp_service import preprocess_text, combine_text
from scripts.test_real_false_positives import real_articles

def run_experiment():
    fake_df = pd.read_csv('backend/data/raw/Fake.csv')
    true_df = pd.read_csv('backend/data/raw/True.csv')
    
    fake_df['label'] = 1
    true_df['label'] = 0
    df = pd.concat([fake_df, true_df], ignore_index=True)
    
    # 1. Baseline: current preprocessing (no stop_words in TfidfVectorizer)
    df['combined'] = df.apply(lambda r: combine_text(str(r['title']), str(r['text'])), axis=1)
    df['clean'] = df['combined'].apply(preprocess_text)
    
    vec_baseline = TfidfVectorizer(max_features=5000)
    X_base = vec_baseline.fit_transform(df['clean'])
    lr_base = LogisticRegression(max_iter=1000, random_state=42).fit(X_base, df['label'])
    rf_base = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_base, df['label'])
    
    # 2. Improvement: English Stopwords + Sublinear TF scaling
    vec_stop = TfidfVectorizer(max_features=5000, stop_words='english', sublinear_tf=True)
    X_stop = vec_stop.fit_transform(df['clean'])
    lr_stop = LogisticRegression(max_iter=1000, random_state=42, C=1.0).fit(X_stop, df['label'])
    rf_stop = RandomForestClassifier(n_estimators=100, random_state=42).fit(X_stop, df['label'])
    
    print("==================================================")
    print("EVALUATING ON 15 OUT-OF-DOMAIN REAL ARTICLES")
    print("==================================================")
    
    print(f"\n--- Baseline LR (no stop_words) ---")
    fp_base_lr = 0
    for title, text in real_articles:
        cl = preprocess_text(combine_text(title, text))
        v = vec_baseline.transform([cl])
        prob = lr_base.predict_proba(v)[0]
        pred = 'FAKE' if prob[1] >= prob[0] else 'REAL'
        if pred == 'FAKE':
            fp_base_lr += 1
            print(f"  [FP] {title} -> P(Fake)={prob[1]*100:.1f}%")
    print(f"Total FP (Baseline LR): {fp_base_lr}/{len(real_articles)}")

    print(f"\n--- Stopwords + Sublinear TF LR ---")
    fp_stop_lr = 0
    for title, text in real_articles:
        cl = preprocess_text(combine_text(title, text))
        v = vec_stop.transform([cl])
        prob = lr_stop.predict_proba(v)[0]
        pred = 'FAKE' if prob[1] >= prob[0] else 'REAL'
        if pred == 'FAKE':
            fp_stop_lr += 1
            print(f"  [FP] {title} -> P(Fake)={prob[1]*100:.1f}%")
    print(f"Total FP (Stopwords LR): {fp_stop_lr}/{len(real_articles)}")

    print(f"\n--- Baseline Random Forest ---")
    fp_base_rf = 0
    for title, text in real_articles:
        cl = preprocess_text(combine_text(title, text))
        v = vec_baseline.transform([cl])
        pred = 'FAKE' if rf_base.predict(v)[0] == 1 else 'REAL'
        if pred == 'FAKE':
            fp_base_rf += 1
            print(f"  [FP] {title}")
    print(f"Total FP (Baseline RF): {fp_base_rf}/{len(real_articles)}")

    print(f"\n--- Stopwords Random Forest ---")
    fp_stop_rf = 0
    for title, text in real_articles:
        cl = preprocess_text(combine_text(title, text))
        v = vec_stop.transform([cl])
        pred = 'FAKE' if rf_stop.predict(v)[0] == 1 else 'REAL'
        if pred == 'FAKE':
            fp_stop_rf += 1
            print(f"  [FP] {title}")
    print(f"Total FP (Stopwords RF): {fp_stop_rf}/{len(real_articles)}")

if __name__ == '__main__':
    run_experiment()
