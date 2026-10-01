import sys
import os
import joblib
import pandas as pd
from sklearn.metrics import classification_report, confusion_matrix

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app.database.session import SessionLocal
from app.models.news_dataset import NewsDataset
from app.core.config import settings
from app.services.nlp_service import preprocess_text, combine_text

def evaluate():
    if not os.path.exists(settings.MODEL_PATH) or not os.path.exists(settings.VECTORIZER_PATH):
        print("Model artifacts not found. Train the model first.")
        return
        
    print("Loading artifacts...")
    model = joblib.load(settings.MODEL_PATH)
    vectorizer = joblib.load(settings.VECTORIZER_PATH)
    
    print("Loading test dataset subset...")
    db = SessionLocal()
    records = db.query(NewsDataset.title, NewsDataset.text, NewsDataset.label).limit(2000).all()
    db.close()
    
    if not records:
        print("No data found in database.")
        return
        
    df = pd.DataFrame(records, columns=['title', 'text', 'label'])
    df['combined'] = df.apply(lambda row: combine_text(row['title'], row['text']), axis=1)
    df['processed'] = df['combined'].apply(preprocess_text)
    
    X_vec = vectorizer.transform(df['processed'])
    y_true = df['label']
    
    print("Predicting...")
    y_pred = model.predict(X_vec)
    
    print("\nClassification Report:")
    print(classification_report(y_true, y_pred, target_names=["REAL (0)", "FAKE (1)"]))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_true, y_pred))

if __name__ == "__main__":
    evaluate()
