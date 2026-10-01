import sys
import os
import argparse
import pandas as pd

# Resolve backend directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)
os.chdir(BACKEND_DIR)

from app.database.connection import Base, engine
from app.database.session import SessionLocal
from app.models.news_dataset import NewsDataset


def import_data(clear_existing: bool = True):
    print("=" * 60)
    print("TruthLens Kaggle Dataset Import Script")
    print("=" * 60)

    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    # Try multiple possible raw data locations
    project_root = os.path.dirname(BACKEND_DIR)
    candidate_dirs = [
        os.path.join(BACKEND_DIR, "data", "raw"),
        os.path.join(project_root, "data", "raw"),
        os.path.join(BACKEND_DIR, "data"),
        os.path.join(project_root, "data"),
    ]

    raw_dir = None
    for candidate in candidate_dirs:
        if os.path.exists(candidate):
            raw_dir = candidate
            break

    if raw_dir is None:
        print("\nERROR: Could not find data/raw directory.")
        print("Expected locations:")
        for d in candidate_dirs:
            print(f"  {d}")
        return

    print(f"\nSource directory: {raw_dir}")

    # File → label mapping (1=FAKE, 0=REAL)
    files = {
        "Fake.csv": 1,
        "True.csv": 0,
    }

    db = SessionLocal()

    existing_count = db.query(NewsDataset).count()
    print(f"Existing records in news_dataset before import: {existing_count}")

    if clear_existing and existing_count > 0:
        db.query(NewsDataset).delete()
        db.commit()
        print("Cleared previous dataset records for clean Kaggle synchronization.")

    total = 0
    real_count = 0
    fake_count = 0
    skipped = 0
    duplicates = 0

    for filename, label in files.items():
        filepath = os.path.join(raw_dir, filename)
        if not os.path.exists(filepath):
            print(f"\n[SKIP] File not found: {filepath}")
            continue

        print(f"\nImporting {filename} (Label: {'FAKE (1)' if label == 1 else 'REAL (0)'})...")
        try:
            df = pd.read_csv(filepath, dtype=str)
        except Exception as e:
            print(f"  ERROR reading {filename}: {e}")
            continue

        # Normalize column names
        df.columns = df.columns.str.strip().str.lower()
        print(f"  Columns detected: {list(df.columns)}")

        batch = []
        file_count = 0

        for _, row in df.iterrows():
            title = str(row.get('title', '') or '').strip()
            text_val = str(row.get('text', '') or '').strip()
            subject = str(row.get('subject', '') or '').strip()
            date_val = str(row.get('date', '') or '').strip()

            if title.lower() == 'nan':
                title = ''
            if text_val.lower() == 'nan':
                text_val = ''
            if subject.lower() == 'nan':
                subject = ''
            if date_val.lower() == 'nan':
                date_val = ''

            if not title and not text_val:
                skipped += 1
                continue

            batch.append(NewsDataset(
                title=title if title else None,
                text=text_val if text_val else None,
                subject=subject[:100] if subject else None,
                date=date_val[:100] if date_val else None,
                label=label,
                source_dataset=filename
            ))

            file_count += 1
            total += 1
            if label == 0:
                real_count += 1
            else:
                fake_count += 1

            if len(batch) >= 500:
                db.bulk_save_objects(batch)
                db.commit()
                batch = []

        if batch:
            db.bulk_save_objects(batch)
            db.commit()

        print(f"  Completed {filename}: {file_count} records imported.")

    final_count = db.query(NewsDataset).count()
    real_db = db.query(NewsDataset).filter(NewsDataset.label == 0).count()
    fake_db = db.query(NewsDataset).filter(NewsDataset.label == 1).count()
    db.close()

    print("\n" + "=" * 60)
    print("PostgreSQL news_dataset Verification Summary")
    print("=" * 60)
    print(f"Total rows in news_dataset: {final_count}")
    print(f"REAL records (label 0):     {real_db}")
    print(f"FAKE records (label 1):     {fake_db}")
    print(f"Invalid skipped:            {skipped}")
    print("=" * 60)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Import Kaggle Fake/True CSV datasets into PostgreSQL")
    parser.add_argument("--append", action="store_true", help="Append rather than replace existing records")
    args = parser.parse_args()

    import_data(clear_existing=not args.append)
