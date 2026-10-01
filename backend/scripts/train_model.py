import sys
import os
import json
import joblib
import pandas as pd
from datetime import datetime
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

# Resolve the backend/ directory and add to path
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)

# Change CWD to backend/ so relative paths in settings work
os.chdir(BACKEND_DIR)

from app.database.session import SessionLocal
from app.models.news_dataset import NewsDataset
from app.models.model_metrics import ModelMetrics
from app.models.model_version import ModelVersion
from app.core.config import settings
from app.services.nlp_service import preprocess_text, combine_text


def resolve_path(relative_path: str) -> str:
    """Resolve a path relative to the backend directory."""
    if os.path.isabs(relative_path):
        return relative_path
    return os.path.join(BACKEND_DIR, relative_path)


def train():
    print("=" * 60)
    print("TruthLens ML Training Pipeline")
    print("=" * 60)
    
    # Resolve artifact paths
    model_path = resolve_path(settings.MODEL_PATH)
    vectorizer_path = resolve_path(settings.VECTORIZER_PATH)
    metrics_path = resolve_path(settings.METRICS_PATH)
    artifacts_dir = os.path.dirname(model_path)
    os.makedirs(artifacts_dir, exist_ok=True)
    
    print(f"\nArtifacts will be saved to: {artifacts_dir}")
    
    print("\n[1/6] Loading data from PostgreSQL...")
    db = SessionLocal()
    try:
        records = db.query(NewsDataset.title, NewsDataset.text, NewsDataset.label).all()
    finally:
        pass  # keep db open for metrics saving
    
    if not records:
        print("ERROR: No data found in news_dataset table.")
        print("Please run: python scripts/import_dataset.py")
        db.close()
        return
    
    df = pd.DataFrame(records, columns=['title', 'text', 'label'])
    print(f"   Loaded {len(df)} records (Real: {(df['label']==0).sum()}, Fake: {(df['label']==1).sum()})")
    
    print("\n[2/6] Preprocessing text...")
    df['combined'] = df.apply(lambda row: combine_text(
        str(row['title']) if row['title'] else '',
        str(row['text']) if row['text'] else ''
    ), axis=1)
    df['processed'] = df['combined'].apply(preprocess_text)
    
    # Drop rows where preprocessing results in empty string
    before_len = len(df)
    df = df[df['processed'].str.len() > 0]
    after_len = len(df)
    if before_len != after_len:
        print(f"   Removed {before_len - after_len} empty-text rows after preprocessing.")
    
    X = df['processed']
    y = df['label']
    
    print("\n[3/6] Splitting dataset (80/20)...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"   Training samples: {len(X_train)}")
    print(f"   Test samples:     {len(X_test)}")
    
    print("\n[4/6] Fitting TF-IDF Vectorizer on training data only...")
    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2), stop_words='english', sublinear_tf=True)
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    print(f"   Vocabulary size: {len(vectorizer.vocabulary_)}")
    
    print("\n[5/6] Training models...")
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
        "Decision Tree": DecisionTreeClassifier(random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, random_state=42),
        "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42)
    }
    
    results = {}
    trained_models = {}
    production_model_name = settings.MODEL_NAME
    
    for name, model in models.items():
        print(f"   Training: {name}...")
        model.fit(X_train_vec, y_train)
        y_pred = model.predict(X_test_vec)
        
        acc  = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec  = float(recall_score(y_test, y_pred, zero_division=0))
        f1   = float(f1_score(y_test, y_pred, zero_division=0))
        
        results[name] = {
            "accuracy":  acc,
            "precision": prec,
            "recall":    rec,
            "f1":        f1
        }
        trained_models[name] = model
        
        # Save metrics to DB
        db_metric = ModelMetrics(
            model_name=name,
            accuracy=acc,
            precision_score=prec,
            recall_score=rec,
            f1_score=f1,
            training_samples=len(X_train),
            test_samples=len(X_test)
        )
        db.add(db_metric)
    
    db.commit()
    
    # Select production model
    if production_model_name not in trained_models:
        print(f"\nWARNING: Configured MODEL_NAME '{production_model_name}' not found.")
        print("Defaulting to 'Logistic Regression'.")
        production_model_name = "Logistic Regression"
    
    production_model = trained_models[production_model_name]
    
    print(f"\n[6/6] Saving artifacts...")
    print(f"   Production model: {production_model_name}")
    joblib.dump(production_model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    
    all_models_path = os.path.join(artifacts_dir, "all_models.pkl")
    joblib.dump(trained_models, all_models_path)
    print(f"   Saved model: {model_path}")
    print(f"   Saved all models bundle: {all_models_path}")
    print(f"   Saved vectorizer: {vectorizer_path}")
    
    # Save metrics JSON
    with open(metrics_path, "w") as f:
        json.dump(results, f, indent=4)
    print(f"   Saved metrics: {metrics_path}")

    
    # Save metadata JSON
    metadata = {
        "model_name": production_model_name,
        "training_date": datetime.utcnow().isoformat(),
        "dataset_size": len(df),
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "features": 5000,
        "random_state": 42,
        "vectorizer": "TfidfVectorizer",
        "vectorizer_config": {"max_features": 5000, "ngram_range": [1, 2]}
    }
    metadata_path = os.path.join(artifacts_dir, "model_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=4)
    print(f"   Saved metadata: {metadata_path}")
    
    # Save model version to DB
    db_version = ModelVersion(
        model_name=production_model_name,
        version="1.0",
        vectorizer_name="TfidfVectorizer",
        training_date=datetime.utcnow(),
        dataset_size=len(df),
        model_path=model_path,
        vectorizer_path=vectorizer_path
    )
    db.add(db_version)
    db.commit()
    db.close()
    
    # Print comparison table
    print("\n" + "=" * 70)
    print("MODEL COMPARISON RESULTS")
    print("=" * 70)
    print(f"{'Model':<30} {'Accuracy':>10} {'Precision':>10} {'Recall':>10} {'F1':>10}")
    print("-" * 70)
    for name, mets in results.items():
        marker = " [PROD]" if name == production_model_name else ""
        print(f"{name:<30} {mets['accuracy']:>10.4f} {mets['precision']:>10.4f} {mets['recall']:>10.4f} {mets['f1']:>10.4f}{marker}")
    print("=" * 70)
    print(f"\nProduction model '{production_model_name}' has been saved.")
    print("Training complete!")


if __name__ == "__main__":
    train()
