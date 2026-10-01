import os
import sys
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score, precision_recall_fscore_support

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.services.nlp_service import preprocess_text, combine_text

def run_investigation():
    print("================================================================")
    print("TRUTHLENS ML GENERALIZATION & ERROR INVESTIGATION")
    print("================================================================")
    
    # 1. Load Data
    fake_df = pd.read_csv('backend/data/raw/Fake.csv')
    true_df = pd.read_csv('backend/data/raw/True.csv')
    
    fake_df['label'] = 1 # FAKE
    true_df['label'] = 0 # REAL
    
    df = pd.concat([fake_df, true_df], ignore_index=True)
    
    # Combine title + text and preprocess
    df['combined_text'] = df.apply(lambda row: combine_text(str(row['title']), str(row['text'])), axis=1)
    df['clean_text'] = df['combined_text'].apply(preprocess_text)
    
    # Check duplicates / leaks
    print("\n--- 11. DATASET LEAKAGE & DUPLICATE CHECK ---")
    exact_duplicates = df.duplicated(subset=['clean_text']).sum()
    print(f"Total rows: {len(df)}")
    print(f"Exact clean text duplicates across dataset: {exact_duplicates}")
    
    # Train / Test split (80/20, random_state=42)
    X = df['clean_text']
    y = df['label']
    
    X_train, X_test, y_train, y_test, idx_train, idx_test = train_test_split(
        X, y, df.index, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Train samples: {len(X_train)} ({sum(y_train==0)} REAL, {sum(y_train==1)} FAKE)")
    print(f"Test samples: {len(X_test)} ({sum(y_test==0)} REAL, {sum(y_test==1)} FAKE)")
    
    # TF-IDF vectorizer
    vectorizer = TfidfVectorizer(max_features=5000)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # Train 4 models
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Decision Tree': DecisionTreeClassifier(random_state=42),
        'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42)
    }
    
    trained_models = {}
    test_results = {}
    
    for name, model in models.items():
        model.fit(X_train_vec, y_train)
        trained_models[name] = model
        
        y_pred = model.predict(X_test_vec)
        y_proba = model.predict_proba(X_test_vec)[:, 1] if hasattr(model, 'predict_proba') else None
        
        acc = accuracy_score(y_test, y_pred)
        prec, rec, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='binary', pos_label=1)
        prec_real, rec_real, f1_real, _ = precision_recall_fscore_support(y_test, y_pred, pos_label=0, average='binary')
        
        cm = confusion_matrix(y_test, y_pred) # [[TN, FP], [FN, TP]] where 0=REAL, 1=FAKE
        # TN: REAL predicted REAL
        # FP: REAL predicted FAKE (False Alarm / Real false positive)
        # FN: FAKE predicted REAL (Missed Fake / Fake false negative)
        # TP: FAKE predicted FAKE
        tn, fp, fn, tp = cm.ravel()
        
        test_results[name] = {
            'accuracy': acc,
            'real_precision': prec_real,
            'real_recall': rec_real,
            'real_f1': f1_real,
            'fake_precision': prec,
            'fake_recall': rec,
            'fake_f1': f1,
            'cm': cm,
            'tn': tn,
            'fp': fp,
            'fn': fn,
            'tp': tp,
            'y_pred': y_pred,
            'y_proba': y_proba
        }

    print("\n--- 1, 2, 3, 9. MODEL COMPARISON ON HELD-OUT TEST SET ---")
    for name, res in test_results.items():
        print(f"\nModel: {name}")
        print(f"  Accuracy:       {res['accuracy']*100:.2f}%")
        print(f"  REAL Precision: {res['real_precision']*100:.2f}% | Recall: {res['real_recall']*100:.2f}% | F1: {res['real_f1']*100:.2f}%")
        print(f"  FAKE Precision: {res['fake_precision']*100:.2f}% | Recall: {res['fake_recall']*100:.2f}% | F1: {res['fake_f1']*100:.2f}%")
        print(f"  Confusion Matrix:")
        print(f"    REAL predicted REAL (TN): {res['tn']}")
        print(f"    REAL predicted FAKE (FP): {res['fp']}")
        print(f"    FAKE predicted REAL (FN): {res['fn']}")
        print(f"    FAKE predicted FAKE (TP): {res['tp']}")
        
    # Let's inspect Feature Importance / Coefficients for Logistic Regression
    lr = trained_models['Logistic Regression']
    feature_names = np.array(vectorizer.get_feature_names_out())
    coefs = lr.coef_[0] # Positive coef = FAKE (label 1), Negative coef = REAL (label 0)
    
    top_fake_idx = np.argsort(coefs)[-20:]
    top_real_idx = np.argsort(coefs)[:20]
    
    print("\n--- 5. SOURCE/STYLE ARTIFACTS & TOP TF-IDF FEATURES ---")
    print("Top 15 words driving FAKE prediction (highest positive coefficients):")
    for idx in reversed(top_fake_idx[-15:]):
        print(f"  {feature_names[idx]:<20}: +{coefs[idx]:.4f}")
        
    print("\nTop 15 words driving REAL prediction (highest negative coefficients):")
    for idx in top_real_idx[:15]:
        print(f"  {feature_names[idx]:<20}: {coefs[idx]:.4f}")

    # Reuters & Dateline presence check
    reuters_in_true = true_df['text'].str.contains('Reuters|reuters', case=False, na=False).sum()
    reuters_in_fake = fake_df['text'].str.contains('Reuters|reuters', case=False, na=False).sum()
    print(f"\n'Reuters' occurrences in True.csv: {reuters_in_true}/{len(true_df)} ({reuters_in_true/len(true_df)*100:.1f}%)")
    print(f"'Reuters' occurrences in Fake.csv: {reuters_in_fake}/{len(fake_df)} ({reuters_in_fake/len(fake_df)*100:.1f}%)")

    # 4 & 6. Generalization Test on Real News Without Datelines / Out-of-Domain Real News
    print("\n--- 4 & 6. GENERALIZATION & ABLATION EXPERIMENTS ---")
    
    test_articles = [
        ("Real BBC Tech", "OpenAI announces new governance framework for frontier artificial intelligence models", "The artificial intelligence research organization stated on Tuesday that new safety evaluations will be applied before releasing advanced neural network architectures."),
        ("Real AP Politics", "Congressional budget committee debates federal deficit and domestic spending targets", "Members of the committee reviewed fiscal projections for the upcoming decade, discussing taxation policies, healthcare spending, and statutory debt ceilings."),
        ("Real Science", "James Webb Space Telescope observes atmosphere of distant exoplanet", "Astronomers using the observatory detected signatures of water vapor and carbon dioxide in the transmission spectrum of a gas giant orbiting a star 700 light-years away."),
        ("Real Local News", "City Council votes to approve public transit expansion and new bike lanes", "Local officials approved a twenty million dollar municipal budget allocation to extend bus rapid transit routes across eastern metropolitan neighborhoods."),
        ("Real Reuters Stripped", "Federal Reserve holds interest rates steady following monetary policy meeting", "The Federal Reserve held benchmark interest rates steady following a monetary policy meeting, citing balanced employment and inflation conditions."),
        ("Real Reuters with Dateline", "Federal Reserve holds interest rates steady", "WASHINGTON (Reuters) - The Federal Reserve held benchmark interest rates steady following a monetary policy meeting."),
        ("Real Medical Paper", "Clinical trial demonstrates efficacy of novel mRNA vaccine for respiratory virus", "A double-blind randomized study involving 30,000 participants showed a 94 percent reduction in severe symptoms with no serious adverse reactions observed."),
        ("Real Financial Times", "European Central Bank leaves deposit rate unchanged at quarterly review", "Governing Council members emphasized a data-dependent approach to future interest rate adjustments during the press conference in Frankfurt."),
        ("Real Business", "Automakers announce multi-billion investment in domestic battery manufacturing facilities", "Major car manufacturers unveiled joint ventures to establish battery cell production plants, creating thousands of specialized engineering jobs."),
        ("Real Environmental", "International ocean treaty enters into legal force after reaching sixty ratifications", "The United Nations agreement establishes guidelines for marine protected areas in international waters beyond national jurisdictions."),
        ("Real Sports", "National basketball championship series goes to deciding seventh game", "Both teams prepared for the decisive final match following a double-overtime thriller that tied the series at three games each."),
        ("Real Education", "State universities expand need-based financial aid for low-income undergraduate students", "Higher education administrators announced grants covering full tuition costs for qualified students whose family income falls below state median levels.")
    ]
    
    print("\nEvaluating Out-of-Domain / Realistic Real News (Ablation: Title-only, Content-only, Title+Content):")
    print(f"{'Headline':<40} | {'Input Type':<15} | {'Predicted':<6} | {'P(Real)':<8} | {'P(Fake)':<8}")
    print("-" * 85)
    
    for title, full_title, content in test_articles:
        for mode in ['Title-only', 'Content-only', 'Title+Content']:
            if mode == 'Title-only':
                txt = preprocess_text(full_title)
            elif mode == 'Content-only':
                txt = preprocess_text(content)
            else:
                txt = preprocess_text(combine_text(full_title, content))
                
            vec = vectorizer.transform([txt])
            prob = lr.predict_proba(vec)[0]
            pred = 'FAKE' if prob[1] >= prob[0] else 'REAL'
            print(f"{title:<40} | {mode:<15} | {pred:<6} | {prob[0]*100:6.2f}% | {prob[1]*100:6.2f}%")

    # 13. Logistic Regression Decision Threshold Analysis
    print("\n--- 13. LOGISTIC REGRESSION DECISION THRESHOLD ANALYSIS ---")
    print("Evaluating classification threshold on test set and cross-validation:")
    
    # 5-fold cross validation for threshold stability
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    thresholds = [0.30, 0.40, 0.50, 0.60, 0.70, 0.80]
    
    for th in thresholds:
        fps, fns, accs = [], [], []
        for train_i, val_i in skf.split(X, y):
            X_tr, X_v = X.iloc[train_i], X.iloc[val_i]
            y_tr, y_v = y.iloc[train_i], y.iloc[val_i]
            
            v = TfidfVectorizer(max_features=5000)
            X_tr_v = v.fit_transform(X_tr)
            X_v_v = v.transform(X_v)
            
            m = LogisticRegression(max_iter=1000, random_state=42)
            m.fit(X_tr_v, y_tr)
            
            p_fake = m.predict_proba(X_v_v)[:, 1]
            preds = (p_fake >= th).astype(int)
            
            cm = confusion_matrix(y_v, preds)
            fps.append(cm[0, 1]) # Real predicted Fake
            fns.append(cm[1, 0]) # Fake predicted Real
            accs.append(accuracy_score(y_v, preds))
            
        print(f"Threshold (P(Fake) >= {th:.2f} => FAKE): Avg Acc: {np.mean(accs)*100:.2f}%, Avg Real FP: {np.mean(fps):.1f}/{len(y_v)/2:.0f}, Avg Fake FN: {np.mean(fns):.1f}/{len(y_v)/2:.0f}")

if __name__ == '__main__':
    run_investigation()
